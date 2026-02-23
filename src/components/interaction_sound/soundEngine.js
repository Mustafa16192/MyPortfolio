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
  const hoverBedState = {
    desiredOn: false,
    enterTimeoutId: null,
    leaveTimeoutId: null,
    nodes: null,
  };
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

  const cancelScheduled = (timeoutId) => {
    if (!timeoutId) {
      return null;
    }
    clearDelay(timeoutId);
    return null;
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

  const rampGain = (audioParam, targetValue, durationMs) => {
    const ctx = ensureAudioContext();
    if (!ctx || !audioParam) {
      return;
    }

    const nowTime = ctx.currentTime;
    const durationS = Math.max(0, Number(durationMs) || 0) / 1000;
    const currentValue = audioParam.value;
    audioParam.cancelScheduledValues(nowTime);
    audioParam.setValueAtTime(currentValue, nowTime);
    if (durationS <= 0) {
      audioParam.setValueAtTime(targetValue, nowTime);
      return;
    }
    audioParam.linearRampToValueAtTime(targetValue, nowTime + durationS);
  };

  const ensureHoverBedNodes = () => {
    const ctx = ensureAudioContext();
    if (!ctx || !masterGain || ctx.state !== "running") {
      return null;
    }

    if (hoverBedState.nodes) {
      return hoverBedState.nodes;
    }

    const mix = ctx.createGain();
    mix.gain.value = 1;

    const highpass = ctx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 120;
    highpass.Q.value = 0.7;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 1280;
    lowpass.Q.value = 0.55;

    const bedGain = ctx.createGain();
    bedGain.gain.value = 0;

    const duckGain = ctx.createGain();
    duckGain.gain.value = 1;

    const oscA = ctx.createOscillator();
    oscA.type = "triangle";
    oscA.frequency.value = 170;

    const oscAGain = ctx.createGain();
    oscAGain.gain.value = 0.085;

    const oscB = ctx.createOscillator();
    oscB.type = "sine";
    oscB.frequency.value = 340;

    const oscBGain = ctx.createGain();
    oscBGain.gain.value = 0.06;

    const noiseBufferDurationS = 1.2;
    const noiseLength = Math.floor(ctx.sampleRate * noiseBufferDurationS);
    const noiseBuffer = ctx.createBuffer(1, noiseLength, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseLength; i += 1) {
      noiseData[i] = (Math.random() * 2 - 1) * 0.18;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    const noiseBandpass = ctx.createBiquadFilter();
    noiseBandpass.type = "bandpass";
    noiseBandpass.frequency.value = 920;
    noiseBandpass.Q.value = 0.8;

    const noiseGain = ctx.createGain();
    noiseGain.gain.value = 0.08;

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.1;

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 260;

    oscA.connect(oscAGain);
    oscAGain.connect(mix);

    oscB.connect(oscBGain);
    oscBGain.connect(mix);

    noiseSource.connect(noiseBandpass);
    noiseBandpass.connect(noiseGain);
    noiseGain.connect(mix);

    mix.connect(highpass);
    highpass.connect(lowpass);
    lowpass.connect(bedGain);
    bedGain.connect(duckGain);
    duckGain.connect(masterGain);

    lfo.connect(lfoGain);
    lfoGain.connect(lowpass.frequency);

    try {
      oscA.start();
      oscB.start();
      noiseSource.start();
      lfo.start();
    } catch (error) {
      // Ignore start errors; nodes will be GC'd on dispose.
    }

    hoverBedState.nodes = {
      mix,
      highpass,
      lowpass,
      bedGain,
      duckGain,
      oscA,
      oscB,
      noiseSource,
      lfo,
      noiseBandpass,
      noiseGain,
      oscAGain,
      oscBGain,
      lfoGain,
    };

    return hoverBedState.nodes;
  };

  const duckHoverBed = ({
    duckTo = 0.58,
    attackMs = 14,
    holdMs = 130,
    releaseMs = 70,
  } = {}) => {
    const nodes = hoverBedState.nodes;
    const ctx = ensureAudioContext();
    if (!nodes || !ctx || ctx.state !== "running") {
      return;
    }

    const target = clamp(duckTo, 0, 1);
    const param = nodes.duckGain.gain;
    const nowTime = ctx.currentTime;
    const attackS = Math.max(0, Number(attackMs) || 0) / 1000;
    const holdS = Math.max(0, Number(holdMs) || 0) / 1000;
    const releaseS = Math.max(0, Number(releaseMs) || 0) / 1000;

    const currentValue = param.value;
    param.cancelScheduledValues(nowTime);
    param.setValueAtTime(currentValue, nowTime);
    param.linearRampToValueAtTime(target, nowTime + attackS);
    param.setValueAtTime(target, nowTime + attackS + holdS);
    param.linearRampToValueAtTime(1, nowTime + attackS + holdS + releaseS);
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

    if (hoverBedState.desiredOn && config.duckBed !== false) {
      duckHoverBed();
    }

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
    hoverBedEnter({
      delayMs = 80,
      fadeInMs = 160,
      targetGain = 0.03,
    } = {}) {
      if (!AudioContextCtor || isDisposed) {
        return false;
      }

      hoverBedState.desiredOn = true;
      hoverBedState.leaveTimeoutId = cancelScheduled(hoverBedState.leaveTimeoutId);
      hoverBedState.enterTimeoutId = cancelScheduled(hoverBedState.enterTimeoutId);

      hoverBedState.enterTimeoutId = schedule(() => {
        hoverBedState.enterTimeoutId = null;
        const nodes = ensureHoverBedNodes();
        if (!nodes) {
          return;
        }
        rampGain(nodes.bedGain.gain, clamp(targetGain, 0, 0.12), fadeInMs);
      }, Math.max(0, Number(delayMs) || 0));

      return true;
    },
    hoverBedLeave({ holdMs = 120, fadeOutMs = 220 } = {}) {
      hoverBedState.desiredOn = false;
      hoverBedState.enterTimeoutId = cancelScheduled(hoverBedState.enterTimeoutId);
      hoverBedState.leaveTimeoutId = cancelScheduled(hoverBedState.leaveTimeoutId);

      hoverBedState.leaveTimeoutId = schedule(() => {
        hoverBedState.leaveTimeoutId = null;
        if (hoverBedState.desiredOn) {
          return;
        }
        const nodes = hoverBedState.nodes;
        if (!nodes) {
          return;
        }
        rampGain(nodes.bedGain.gain, 0, fadeOutMs);
      }, Math.max(0, Number(holdMs) || 0));

      return true;
    },
    hoverBedStop({ fadeOutMs = 0 } = {}) {
      hoverBedState.desiredOn = false;
      hoverBedState.enterTimeoutId = cancelScheduled(hoverBedState.enterTimeoutId);
      hoverBedState.leaveTimeoutId = cancelScheduled(hoverBedState.leaveTimeoutId);

      const nodes = hoverBedState.nodes;
      if (!nodes) {
        return false;
      }
      rampGain(nodes.bedGain.gain, 0, fadeOutMs);
      rampGain(nodes.duckGain.gain, 1, fadeOutMs);
      return true;
    },
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
      hoverBedState.enterTimeoutId = null;
      hoverBedState.leaveTimeoutId = null;
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
      if (hoverBedState.nodes) {
        const { oscA, oscB, noiseSource, lfo } = hoverBedState.nodes;
        [oscA, oscB, noiseSource, lfo].forEach((node) => {
          try {
            node.stop();
          } catch (error) {
            // ignore
          }
        });
        hoverBedState.nodes = null;
      }
      if (audioContext && typeof audioContext.close === "function") {
        audioContext.close().catch(() => {});
      }
      audioContext = null;
      masterGain = null;
    },
  };
};
