const decodeAudioDataCompat = (audioContext, arrayBuffer) =>
  new Promise((resolve, reject) => {
    try {
      const result = audioContext.decodeAudioData(
        arrayBuffer,
        (decoded) => resolve(decoded),
        (error) => reject(error)
      );

      if (result && typeof result.then === "function") {
        result.then(resolve).catch(reject);
      }
    } catch (error) {
      reject(error);
    }
  });

const now = () =>
  typeof performance !== "undefined" && performance.now
    ? performance.now()
    : Date.now();

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const createInteractionSoundEngine = ({
  eventRegistry = {},
  assetUrls = {},
} = {}) => {
  const hasWindow = typeof window !== "undefined";
  const AudioContextCtor = hasWindow
    ? window.AudioContext || window.webkitAudioContext
    : null;

  const buffers = new Map();
  const audioPools = new Map();
  const lastPlayedAt = new Map();
  const timeouts = new Set();
  const uniqueAssets = Array.from(
    new Set(
      Object.values(eventRegistry)
        .map((config) => assetUrls[config.asset])
        .filter(Boolean)
    )
  );

  let audioContext = null;
  let masterGain = null;
  let isArmed = false;
  let decodePromise = null;
  let isDisposed = false;

  const clearDelay = (timeoutId) => {
    if (timeouts.has(timeoutId)) {
      timeouts.delete(timeoutId);
    }
    window.clearTimeout(timeoutId);
  };

  const schedule = (callback, delayMs) => {
    if (!hasWindow) {
      return 0;
    }
    const timeoutId = window.setTimeout(() => {
      timeouts.delete(timeoutId);
      callback();
    }, delayMs);
    timeouts.add(timeoutId);
    return timeoutId;
  };

  const ensureAudioPool = (src, poolSize = 3) => {
    if (!hasWindow || !src) {
      return [];
    }

    const existing = audioPools.get(src);
    if (existing && existing.length >= poolSize) {
      return existing;
    }

    const pool = existing || [];
    const nextCount = Math.max(poolSize, pool.length);
    while (pool.length < nextCount) {
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.crossOrigin = "anonymous";
      try {
        audio.load();
      } catch (error) {
        // Ignore load errors; playback will fail gracefully.
      }
      pool.push(audio);
    }
    audioPools.set(src, pool);
    return pool;
  };

  const prewarmAudioPools = () => {
    if (!hasWindow) {
      return;
    }

    uniqueAssets.forEach((src) => {
      ensureAudioPool(src, 2);
    });
  };

  const ensureAudioContext = () => {
    if (!AudioContextCtor || isDisposed) {
      return null;
    }

    if (!audioContext) {
      audioContext = new AudioContextCtor();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 1;
      masterGain.connect(audioContext.destination);
    }

    return audioContext;
  };

  const decodeAllBuffers = async () => {
    if (!AudioContextCtor || isDisposed) {
      return;
    }

    if (decodePromise) {
      return decodePromise;
    }

    const ctx = ensureAudioContext();
    if (!ctx) {
      return;
    }

    decodePromise = (async () => {
      await Promise.all(
        Object.entries(assetUrls).map(async ([assetKey, src]) => {
          if (!src || buffers.has(assetKey)) {
            return;
          }

          try {
            const response = await fetch(src, { cache: "force-cache" });
            const arrayBuffer = await response.arrayBuffer();
            const decoded = await decodeAudioDataCompat(ctx, arrayBuffer);
            buffers.set(assetKey, decoded);
          } catch (error) {
            // Keep fallback HTMLAudio path available.
          }
        })
      );
    })();

    try {
      await decodePromise;
    } finally {
      decodePromise = null;
    }
  };

  const arm = async () => {
    if (isDisposed) {
      return false;
    }

    prewarmAudioPools();

    if (!AudioContextCtor) {
      isArmed = true;
      return true;
    }

    const ctx = ensureAudioContext();
    if (!ctx) {
      return false;
    }

    try {
      if (ctx.state === "suspended") {
        await ctx.resume();
      }
    } catch (error) {
      // Continue; fallback pool may still work.
    }

    isArmed = ctx.state === "running";

    try {
      await decodeAllBuffers();
    } catch (error) {
      // Fallback path still usable.
    }

    return isArmed;
  };

  const playWithBuffer = (buffer, volume) => {
    const ctx = ensureAudioContext();
    if (!ctx || !masterGain || ctx.state !== "running" || !buffer) {
      return false;
    }

    const source = ctx.createBufferSource();
    const gainNode = ctx.createGain();
    gainNode.gain.value = clamp(volume, 0, 1);
    source.buffer = buffer;
    source.connect(gainNode);
    gainNode.connect(masterGain);
    source.start(0);
    return true;
  };

  const playWithAudioPool = (src, volume, poolSize) => {
    if (!hasWindow || !src) {
      return false;
    }

    const pool = ensureAudioPool(src, poolSize);
    if (!pool.length) {
      return false;
    }

    const audio =
      pool.find((entry) => entry.paused || entry.ended) ||
      pool[0];

    try {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = clamp(volume, 0, 1);
      const playResult = audio.play();
      if (playResult && typeof playResult.catch === "function") {
        playResult.catch(() => {});
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const playNow = (eventName, options = {}) => {
    if (isDisposed) {
      return false;
    }

    const config = eventRegistry[eventName];
    if (!config) {
      return false;
    }

    const timestamp = now();
    const cooldownMs = Number.isFinite(config.cooldownMs) ? config.cooldownMs : 0;
    const cooldownKey = config.cooldownKey || eventName;
    const last = lastPlayedAt.get(cooldownKey) || 0;

    if (!options.bypassCooldown && cooldownMs > 0 && timestamp - last < cooldownMs) {
      return false;
    }

    lastPlayedAt.set(cooldownKey, timestamp);

    const volumeMultiplier = Number.isFinite(options.volumeMultiplier)
      ? options.volumeMultiplier
      : 1;
    const volume = clamp((config.volume || 0.25) * volumeMultiplier, 0, 1);

    const buffer = buffers.get(config.asset);
    if (buffer && playWithBuffer(buffer, volume)) {
      return true;
    }

    return playWithAudioPool(assetUrls[config.asset], volume, config.poolSize || 3);
  };

  prewarmAudioPools();

  return {
    prewarm: prewarmAudioPools,
    arm,
    isArmed: () => isArmed,
    play(eventName, options = {}) {
      const delayMs = Number.isFinite(options.delayMs) ? options.delayMs : 0;
      if (delayMs > 0 && hasWindow) {
        schedule(() => {
          playNow(eventName, { ...options, delayMs: 0 });
        }, delayMs);
        return true;
      }

      return playNow(eventName, options);
    },
    dispose() {
      isDisposed = true;
      Array.from(timeouts).forEach(clearDelay);
      audioPools.forEach((pool) => {
        pool.forEach((audio) => {
          try {
            audio.pause();
            audio.src = "";
          } catch (error) {
            // Ignore cleanup errors.
          }
        });
      });
      audioPools.clear();
      buffers.clear();
      lastPlayedAt.clear();
      if (audioContext && typeof audioContext.close === "function") {
        audioContext.close().catch(() => {});
      }
      audioContext = null;
      masterGain = null;
    },
  };
};
