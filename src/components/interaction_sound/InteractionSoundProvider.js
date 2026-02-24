import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import { SOUND_ASSETS, SOUND_EVENT_REGISTRY } from "./soundRegistry";
import { createInteractionSoundEngine } from "./soundEngine";
import "./style.css";

const SOUND_ENABLED_STORAGE_KEY = "portfolio-sound-enabled-v1";
const SOUND_INTRO_SEEN_STORAGE_KEY = "portfolio-sound-intro-seen-v1";
const INTRO_SHOW_DELAY_MS = 2600;
const INTRO_VISIBLE_MS = 5200;
const INTRO_EXIT_MS = 220;
const INTERACTIVE_HOVER_SELECTOR =
  "a[href], button, [role=\"button\"], [role=\"link\"], summary, input[type=\"button\"], input[type=\"submit\"], input[type=\"reset\"]";

export const InteractionSoundContext = createContext({
  isEnabled: false,
  isArmed: false,
  hasSeenPrompt: false,
  isPromptVisible: false,
  enableSound: () => {},
  disableSound: () => {},
  toggleSound: () => {},
  armAudioFromUserGesture: () => Promise.resolve(false),
  markPromptDismissed: () => {},
  tiltCardHoverEnter: () => false,
  tiltCardHoverLeave: () => false,
  play: () => false,
});

const safeReadStorage = (key) => {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch (error) {
    return null;
  }
};

const safeWriteStorage = (key, value) => {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    // Ignore storage failures; state still works in-memory.
  }
};

const getDesktopEligible = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  return (
    window.matchMedia("(min-width: 992px)").matches &&
    !window.matchMedia("(pointer: coarse)").matches
  );
};

const getHoverEligible = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  return (
    window.matchMedia("(min-width: 992px)").matches &&
    window.matchMedia("(hover: hover) and (pointer: fine)").matches
  );
};

const InteractionSoundPrompt = ({
  isMounted,
  isVisible,
  onEnable,
  onDismiss,
}) => {
  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={`interaction_sound_prompt ${isVisible ? "is-visible" : ""}`.trim()}
      aria-hidden={!isVisible}
    >
      <div
        className="interaction_sound_prompt_panel"
        role="dialog"
        aria-label="Enable interaction sounds"
      >
        <div className="interaction_sound_prompt_header">
          <div className="interaction_sound_prompt_icon" aria-hidden="true">
            <span className="interaction_sound_prompt_icon_orb" />
          </div>
          <div className="interaction_sound_prompt_copy">
            <p className="interaction_sound_prompt_title">Sound mode</p>
            <p className="interaction_sound_prompt_text">
              Enable subtle interaction sound for a more tactile experience.
            </p>
          </div>
        </div>

        <div className="interaction_sound_prompt_actions">
          <button
            type="button"
            className="interaction_sound_prompt_btn"
            onClick={onDismiss}
          >
            Not now
          </button>
          <button
            type="button"
            className="interaction_sound_prompt_btn interaction_sound_prompt_btn_primary"
            onClick={onEnable}
          >
            Enable
          </button>
        </div>
      </div>
    </div>
  );
};

export const InteractionSoundProvider = ({
  children,
  isTerminalOverlayOpen = false,
}) => {
  const location = useLocation();
  const engineRef = useRef(null);
  const showTimerRef = useRef(null);
  const autoHideTimerRef = useRef(null);
  const unmountTimerRef = useRef(null);
  const lastHoveredClickableRef = useRef(null);
  const [isEnabled, setIsEnabled] = useState(
    () => safeReadStorage(SOUND_ENABLED_STORAGE_KEY) !== "0"
  );
  const [hasSeenPrompt, setHasSeenPrompt] = useState(
    () => safeReadStorage(SOUND_INTRO_SEEN_STORAGE_KEY) === "1"
  );
  const [isArmed, setIsArmed] = useState(false);
  const [isDesktopEligible, setIsDesktopEligible] = useState(() =>
    getDesktopEligible()
  );
  const [isHoverEligible, setIsHoverEligible] = useState(() =>
    getHoverEligible()
  );
  const [isPromptMounted, setIsPromptMounted] = useState(false);
  const [isPromptVisible, setIsPromptVisible] = useState(false);

  if (!engineRef.current && typeof window !== "undefined") {
    engineRef.current = createInteractionSoundEngine({
      eventRegistry: SOUND_EVENT_REGISTRY,
      assetUrls: SOUND_ASSETS,
    });
  }

  const clearPromptTimers = useCallback(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (autoHideTimerRef.current) {
      clearTimeout(autoHideTimerRef.current);
      autoHideTimerRef.current = null;
    }
    if (unmountTimerRef.current) {
      clearTimeout(unmountTimerRef.current);
      unmountTimerRef.current = null;
    }
  }, []);

  const markPromptSeen = useCallback(() => {
    setHasSeenPrompt(true);
    safeWriteStorage(SOUND_INTRO_SEEN_STORAGE_KEY, "1");
  }, []);

  const hidePrompt = useCallback(
    ({ markSeen = false } = {}) => {
      clearPromptTimers();
      setIsPromptVisible(false);

      if (!isPromptMounted) {
        if (markSeen && !hasSeenPrompt) {
          markPromptSeen();
        }
        return;
      }

      unmountTimerRef.current = window.setTimeout(() => {
        setIsPromptMounted(false);
        unmountTimerRef.current = null;
        if (markSeen && !hasSeenPrompt) {
          markPromptSeen();
        }
      }, INTRO_EXIT_MS);
    },
    [clearPromptTimers, hasSeenPrompt, isPromptMounted, markPromptSeen]
  );

  const showPrompt = useCallback(() => {
    clearPromptTimers();
    setIsPromptMounted(true);
    setIsPromptVisible(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsPromptVisible(true);
      });
    });

    autoHideTimerRef.current = window.setTimeout(() => {
      hidePrompt({ markSeen: true });
      autoHideTimerRef.current = null;
    }, INTRO_VISIBLE_MS);
  }, [clearPromptTimers, hidePrompt]);

  const armAudioFromUserGesture = useCallback(async () => {
    if (!engineRef.current) {
      return false;
    }

    const armed = await engineRef.current.arm();
    const resolvedArmed = engineRef.current.isArmed
      ? engineRef.current.isArmed()
      : armed;
    setIsArmed(resolvedArmed);
    return resolvedArmed;
  }, []);

  const play = useCallback(
    (eventName, options = {}) => {
      if (!engineRef.current) {
        return false;
      }

      if (!isEnabled && !options.force) {
        return false;
      }

      const played = engineRef.current.play(eventName, options);

      if (!played && !isArmed) {
        void armAudioFromUserGesture().then((armed) => {
          if (!armed || !engineRef.current) {
            return;
          }
          engineRef.current.play(eventName, options);
        });
      }

      return played;
    },
    [armAudioFromUserGesture, isArmed, isEnabled]
  );

  const tiltCardHoverEnter = useCallback(() => {
    if (!engineRef.current || !isEnabled || !isHoverEligible) {
      return false;
    }

    const didStart = engineRef.current.tiltCardAmbienceEnter?.() ?? false;

    if (!isArmed) {
      void armAudioFromUserGesture().then((armed) => {
        if (!armed || !engineRef.current || !isEnabled) {
          return;
        }
        engineRef.current.tiltCardAmbienceEnter?.();
      });
    }

    return didStart;
  }, [armAudioFromUserGesture, isArmed, isEnabled, isHoverEligible]);

  const tiltCardHoverLeave = useCallback(() => {
    if (!engineRef.current) {
      return false;
    }

    return engineRef.current.tiltCardAmbienceLeave?.() ?? false;
  }, []);

  const enableSound = useCallback(async () => {
    setIsEnabled(true);
    safeWriteStorage(SOUND_ENABLED_STORAGE_KEY, "1");
    hidePrompt({ markSeen: true });
    await armAudioFromUserGesture();
    engineRef.current?.play("ui.sound.enabled", { bypassCooldown: true });
  }, [armAudioFromUserGesture, hidePrompt]);

  const disableSound = useCallback(() => {
    if (isEnabled) {
      engineRef.current?.play("ui.sound.disabled", { bypassCooldown: true });
    }
    engineRef.current?.tiltCardAmbienceStop?.({ fadeOutMs: 0 });
    lastHoveredClickableRef.current = null;
    setIsEnabled(false);
    safeWriteStorage(SOUND_ENABLED_STORAGE_KEY, "0");
    if (!hasSeenPrompt) {
      markPromptSeen();
    }
    hidePrompt({ markSeen: true });
  }, [hasSeenPrompt, hidePrompt, isEnabled, markPromptSeen]);

  const toggleSound = useCallback(() => {
    if (isEnabled) {
      disableSound();
      return;
    }
    enableSound();
  }, [disableSound, enableSound, isEnabled]);

  const markPromptDismissed = useCallback(() => {
    hidePrompt({ markSeen: true });
  }, [hidePrompt]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined;
    }

    const widthMq = window.matchMedia("(min-width: 992px)");
    const pointerMq = window.matchMedia("(pointer: coarse)");
    const hoverMq = window.matchMedia("(hover: hover) and (pointer: fine)");

    const sync = () => {
      setIsDesktopEligible(widthMq.matches && !pointerMq.matches);
      setIsHoverEligible(widthMq.matches && hoverMq.matches);
    };

    sync();

    if (widthMq.addEventListener) {
      widthMq.addEventListener("change", sync);
      pointerMq.addEventListener("change", sync);
      hoverMq.addEventListener("change", sync);
      return () => {
        widthMq.removeEventListener("change", sync);
        pointerMq.removeEventListener("change", sync);
        hoverMq.removeEventListener("change", sync);
      };
    }

    widthMq.addListener(sync);
    pointerMq.addListener(sync);
    hoverMq.addListener(sync);
    return () => {
      widthMq.removeListener(sync);
      pointerMq.removeListener(sync);
      hoverMq.removeListener(sync);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    if (!isEnabled || !isHoverEligible) {
      lastHoveredClickableRef.current = null;
      return undefined;
    }

    const isDisabledClickable = (element) =>
      element.hasAttribute("disabled") ||
      element.getAttribute("aria-disabled") === "true";

    const isVisibleClickable = (element) => {
      if (!element || typeof element.getClientRects !== "function") {
        return false;
      }
      return element.getClientRects().length > 0;
    };

    const shouldSkipHoverSound = (element) => {
      if (!element) {
        return true;
      }

      const hoverMode = element.getAttribute("data-sound-hover");
      if (hoverMode === "off" || hoverMode === "tilt-card") {
        return true;
      }

      return isDisabledClickable(element) || !isVisibleClickable(element);
    };

    const resetLastHoveredClickable = () => {
      lastHoveredClickableRef.current = null;
    };

    const handlePointerOver = (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest("[data-sound-hover=\"tilt-card\"]")) {
        return;
      }

      const clickable = target.closest(INTERACTIVE_HOVER_SELECTOR);
      if (!clickable || shouldSkipHoverSound(clickable)) {
        return;
      }

      if (lastHoveredClickableRef.current === clickable) {
        return;
      }

      lastHoveredClickableRef.current = clickable;
      if (!isArmed) {
        void armAudioFromUserGesture();
      }
      play("ui.hover.interactive");
    };

    document.addEventListener("pointerover", handlePointerOver, true);
    document.addEventListener("pointerdown", resetLastHoveredClickable, true);
    window.addEventListener("blur", resetLastHoveredClickable);

    return () => {
      document.removeEventListener("pointerover", handlePointerOver, true);
      document.removeEventListener("pointerdown", resetLastHoveredClickable, true);
      window.removeEventListener("blur", resetLastHoveredClickable);
    };
  }, [armAudioFromUserGesture, isArmed, isEnabled, isHoverEligible, play]);

  useEffect(() => {
    if (!isEnabled || !isArmed || !isHoverEligible) {
      engineRef.current?.tiltCardAmbienceStop?.({ fadeOutMs: 80 });
    }
  }, [isArmed, isEnabled, isHoverEligible]);

  useEffect(() => {
    if (isArmed) {
      return undefined;
    }

    const handleFirstGesture = () => {
      armAudioFromUserGesture();
    };

    window.addEventListener("pointerdown", handleFirstGesture, {
      capture: true,
      passive: true,
    });
    window.addEventListener("pointermove", handleFirstGesture, {
      capture: true,
      passive: true,
    });
    window.addEventListener("keydown", handleFirstGesture, true);

    return () => {
      window.removeEventListener("pointerdown", handleFirstGesture, true);
      window.removeEventListener("pointermove", handleFirstGesture, true);
      window.removeEventListener("keydown", handleFirstGesture, true);
    };
  }, [armAudioFromUserGesture, isArmed]);

  const isPromptSuppressedRoute = useMemo(() => {
    const pathname = location.pathname || "/";
    return pathname === "/terminal" || pathname.startsWith("/project/");
  }, [location.pathname]);

  useEffect(() => {
    clearPromptTimers();

    const canShowPrompt =
      isDesktopEligible &&
      !hasSeenPrompt &&
      !isEnabled &&
      !isTerminalOverlayOpen &&
      !isPromptSuppressedRoute;

    if (!canShowPrompt) {
      setIsPromptVisible(false);
      setIsPromptMounted(false);
      return undefined;
    }

    showTimerRef.current = window.setTimeout(() => {
      showPrompt();
      showTimerRef.current = null;
    }, INTRO_SHOW_DELAY_MS);

    return clearPromptTimers;
  }, [
    clearPromptTimers,
    hasSeenPrompt,
    isDesktopEligible,
    isEnabled,
    isPromptSuppressedRoute,
    isTerminalOverlayOpen,
    showPrompt,
  ]);

  useEffect(
    () => () => {
      clearPromptTimers();
      engineRef.current?.dispose();
    },
    [clearPromptTimers]
  );

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    const handleVisibility = () => {
      if (document.visibilityState !== "visible") {
        engineRef.current?.tiltCardAmbienceStop?.({ fadeOutMs: 80 });
        lastHoveredClickableRef.current = null;
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  const contextValue = useMemo(
    () => ({
      isEnabled,
      isArmed,
      hasSeenPrompt,
      isPromptVisible: isPromptMounted && isPromptVisible,
      enableSound,
      disableSound,
      toggleSound,
      armAudioFromUserGesture,
      markPromptDismissed,
      tiltCardHoverEnter,
      tiltCardHoverLeave,
      play,
    }),
    [
      armAudioFromUserGesture,
      disableSound,
      enableSound,
      hasSeenPrompt,
      isArmed,
      isEnabled,
      isPromptMounted,
      isPromptVisible,
      markPromptDismissed,
      play,
      tiltCardHoverEnter,
      tiltCardHoverLeave,
      toggleSound,
    ]
  );

  return (
    <InteractionSoundContext.Provider value={contextValue}>
      {children}
      <InteractionSoundPrompt
        isMounted={isPromptMounted}
        isVisible={isPromptVisible}
        onEnable={enableSound}
        onDismiss={markPromptDismissed}
      />
    </InteractionSoundContext.Provider>
  );
};
