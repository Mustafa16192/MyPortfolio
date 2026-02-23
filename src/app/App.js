import React, { useCallback, useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes";
import Headermain from "../header";
import AnimatedCursor from "../hooks/AnimatedCursor";
import { PmTerminalShell } from "../components/pm_terminal";
import { useGlobalTerminalShortcut } from "../components/pm_terminal/useGlobalTerminalShortcut";
import { InteractionSoundProvider } from "../components/interaction_sound";
import { FaGithub } from "react-icons/fa";
import "./App.css";

const stripPublicBase = (path) => {
  const base = process.env.PUBLIC_URL || "";

  if (!base || base === "/") {
    return path || "/";
  }

  if (path === base) {
    return "/";
  }

  return path.startsWith(base) ? path.slice(base.length) || "/" : path || "/";
};

const readCurrentRoutePath = () => {
  if (typeof window === "undefined") {
    return "/";
  }

  const path = `${window.location.pathname}${window.location.hash || ""}`;
  return stripPublicBase(path);
};

export default function App() {
  const [isBadgeOpen, setIsBadgeOpen] = useState(false);
  const [terminalOverlay, setTerminalOverlay] = useState({
    mounted: false,
    open: false,
    sessionKey: 0,
    path: "/",
  });
  const badgeWrapRef = useRef(null);
  const closeTimerRef = useRef(null);
  const focusRestoreRef = useRef(null);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const openBadgePopover = useCallback(() => {
    clearCloseTimer();
    setIsBadgeOpen(true);
  }, [clearCloseTimer]);

  const scheduleBadgeClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsBadgeOpen(false);
      closeTimerRef.current = null;
    }, 180);
  }, [clearCloseTimer]);

  const handleBadgeBlur = useCallback(
    (event) => {
      const nextFocused = event.relatedTarget;
      if (
        badgeWrapRef.current &&
        nextFocused &&
        badgeWrapRef.current.contains(nextFocused)
      ) {
        return;
      }
      scheduleBadgeClose();
    },
    [scheduleBadgeClose]
  );

  const handleBadgeKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        clearCloseTimer();
        setIsBadgeOpen(false);
      }
    },
    [clearCloseTimer]
  );

  useEffect(
    () => () => {
      clearCloseTimer();
    },
    [clearCloseTimer]
  );

  const openTerminalOverlay = useCallback(() => {
    const routePath = readCurrentRoutePath();

    if (routePath.startsWith("/terminal")) {
      return;
    }

    focusRestoreRef.current =
      typeof document !== "undefined" ? document.activeElement : null;

    setTerminalOverlay((prev) => {
      if (prev.mounted && prev.open) {
        return prev;
      }

      return {
        mounted: true,
        open: true,
        sessionKey: prev.sessionKey + 1,
        path: routePath,
      };
    });
  }, []);

  const closeTerminalOverlay = useCallback(() => {
    setTerminalOverlay((prev) => {
      if (!prev.mounted || !prev.open) {
        return prev;
      }

      return {
        ...prev,
        open: false,
      };
    });
  }, []);

  const handleTerminalOverlayExited = useCallback(() => {
    setTerminalOverlay((prev) => {
      if (!prev.mounted) {
        return prev;
      }

      return {
        ...prev,
        mounted: false,
        open: false,
      };
    });

    const focusTarget = focusRestoreRef.current;
    if (
      focusTarget &&
      typeof focusTarget.focus === "function" &&
      typeof document !== "undefined" &&
      document.contains(focusTarget)
    ) {
      focusTarget.focus();
    }
    focusRestoreRef.current = null;
  }, []);

  useGlobalTerminalShortcut({
    onTrigger: openTerminalOverlay,
    enabled: true,
  });

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <InteractionSoundProvider isTerminalOverlayOpen={terminalOverlay.open}>
        <div className={`app_shell ${terminalOverlay.open ? "is-terminal-open" : ""}`}>
          <div className="global-ambient-bg" aria-hidden="true" />
          <div className="cursor__dot">
            <AnimatedCursor
              innerSize={15}
              outerSize={15}
              color="255, 255 ,255"
              outerAlpha={0.4}
              innerScale={0.7}
              outerScale={5}
            />
          </div>
          <Headermain
            onOpenTerminal={openTerminalOverlay}
            isTerminalOpen={terminalOverlay.open}
          />
          <AppRoutes />
          <div
            ref={badgeWrapRef}
            className={`framer_badge_wrap ${isBadgeOpen ? "is-open" : ""}`}
            onMouseEnter={openBadgePopover}
            onMouseLeave={scheduleBadgeClose}
            onFocus={openBadgePopover}
            onBlur={handleBadgeBlur}
            onKeyDown={handleBadgeKeyDown}
          >
            <div
              className="framer_badge"
              tabIndex={0}
              role="button"
              aria-label="Built and coded by me"
              aria-haspopup="dialog"
              aria-expanded={isBadgeOpen}
              aria-controls="framer-badge-popover"
            >
              <span className="framer_badge_icon" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="44.65 33.992 50.7 76.049"
                  focusable="false"
                >
                  <path
                    d="M 44.65 33.992 L 95.35 33.992 L 95.35 59.341 L 70 59.341 Z M 44.65 59.341 L 70 59.341 L 95.35 84.691 L 44.65 84.691 Z M 44.65 84.691 L 70 84.691 L 70 110.041 Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span className="framer_badge_text">Not Made in Framer ;)</span>
            </div>

            <div
              id="framer-badge-popover"
              className="framer_badge_popover"
              role="dialog"
              aria-label="Project attribution"
              aria-hidden={!isBadgeOpen}
              onMouseEnter={openBadgePopover}
              onMouseLeave={scheduleBadgeClose}
              onFocus={openBadgePopover}
              onBlur={handleBadgeBlur}
            >
              <p className="framer_badge_popover_copy">
                Built and coded by me with React, GSAP, and modern web technologies.
              </p>
              <a
                className="framer_badge_popover_link"
                href="https://github.com/Mustafa16192/MyPortfolio"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub aria-hidden="true" />
                <span>View Source</span>
              </a>
            </div>
          </div>
          {terminalOverlay.mounted ? (
            <PmTerminalShell
              key={`pm-terminal-overlay-${terminalOverlay.sessionKey}`}
              mode="overlay"
              isOpen={terminalOverlay.open}
              initialPath={terminalOverlay.path}
              onRequestClose={closeTerminalOverlay}
              onCloseComplete={handleTerminalOverlayExited}
            />
          ) : null}
        </div>
      </InteractionSoundProvider>
    </Router>
  );
}
