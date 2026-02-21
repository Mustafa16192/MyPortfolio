import React, { useCallback, useEffect, useRef, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import withRouter from "../hooks/withRouter";
import AppRoutes from "./routes";
import Headermain from "../header";
import AnimatedCursor from "../hooks/AnimatedCursor";
import { FaGithub } from "react-icons/fa";
import "./App.css";

function _ScrollToTop(props) {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return props.children;
}
const ScrollToTop = withRouter(_ScrollToTop);

export default function App() {
  const [isBadgeOpen, setIsBadgeOpen] = useState(false);
  const badgeWrapRef = useRef(null);
  const closeTimerRef = useRef(null);

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

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="app_shell">
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
        <ScrollToTop>
          <Headermain />
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
              <span className="framer_badge_text">Built &amp; Coded by Me</span>
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
        </ScrollToTop>
      </div>
    </Router>
  );
}
