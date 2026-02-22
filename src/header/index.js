import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./style.css";
import { VscGrabber, VscClose } from "react-icons/vsc";
import { Link, useLocation } from "react-router-dom";
import { logotext, socialprofils } from "../content_option";
import Themetoggle from "../components/themetoggle";
import brandImage from "../assets/images/me_final.png";

const DEV_MODE_HINT_STORAGE_KEY = "pm-terminal-devmode-hint-seen-v1";
const DEV_MODE_HINT_SHOW_DELAY_MS = 3800;
const DEV_MODE_HINT_VISIBLE_MS = 4200;

const readDevModeHintSeen = () => {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(DEV_MODE_HINT_STORAGE_KEY) === "1";
  } catch (error) {
    return false;
  }
};

const writeDevModeHintSeen = () => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(DEV_MODE_HINT_STORAGE_KEY, "1");
  } catch (error) {
    // Ignore storage failures and fall back to in-memory state.
  }
};

const getHintDesktopCapable = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  const desktopWidth = window.matchMedia("(min-width: 992px)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  return desktopWidth && !coarsePointer;
};

const Headermain = ({ onOpenTerminal, isTerminalOpen = false }) => {
  const location = useLocation();
  const [isActive, setActive] = useState(true);
  const [isDevModeHintVisible, setIsDevModeHintVisible] = useState(false);
  const [hasDevModeHintBeenSeen, setHasDevModeHintBeenSeen] = useState(() =>
    readDevModeHintSeen()
  );
  const [isHintDesktopCapable, setIsHintDesktopCapable] = useState(() =>
    getHintDesktopCapable()
  );
  const hintShowTimerRef = useRef(null);
  const hintHideTimerRef = useRef(null);

  const handleToggle = () => {
    setActive((prev) => !prev);
    document.body.classList.toggle("ovhidden");
  };

  const clearDevModeHintTimers = useCallback(() => {
    if (hintShowTimerRef.current) {
      clearTimeout(hintShowTimerRef.current);
      hintShowTimerRef.current = null;
    }
    if (hintHideTimerRef.current) {
      clearTimeout(hintHideTimerRef.current);
      hintHideTimerRef.current = null;
    }
  }, []);

  const markDevModeHintSeen = useCallback(() => {
    setHasDevModeHintBeenSeen(true);
    writeDevModeHintSeen();
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 992px)");

    const handleDesktop = (event) => {
      if (event.matches) {
        setActive(true);
        document.body.classList.remove("ovhidden");
      }
    };

    handleDesktop(mq);

    if (mq.addEventListener) {
      mq.addEventListener("change", handleDesktop);
      return () => mq.removeEventListener("change", handleDesktop);
    }

    mq.addListener(handleDesktop);
    return () => mq.removeListener(handleDesktop);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined;
    }

    const widthMq = window.matchMedia("(min-width: 992px)");
    const pointerMq = window.matchMedia("(pointer: coarse)");

    const syncHintCapability = () => {
      setIsHintDesktopCapable(widthMq.matches && !pointerMq.matches);
    };

    syncHintCapability();

    if (widthMq.addEventListener) {
      widthMq.addEventListener("change", syncHintCapability);
      pointerMq.addEventListener("change", syncHintCapability);
      return () => {
        widthMq.removeEventListener("change", syncHintCapability);
        pointerMq.removeEventListener("change", syncHintCapability);
      };
    }

    widthMq.addListener(syncHintCapability);
    pointerMq.addListener(syncHintCapability);
    return () => {
      widthMq.removeListener(syncHintCapability);
      pointerMq.removeListener(syncHintCapability);
    };
  }, []);

  const isHintSuppressedRoute = useMemo(() => {
    const pathname = location.pathname || "/";
    return pathname === "/terminal" || pathname.startsWith("/project/");
  }, [location.pathname]);

  useEffect(() => {
    if (!isTerminalOpen) {
      return;
    }

    clearDevModeHintTimers();
    setIsDevModeHintVisible(false);

    if (!hasDevModeHintBeenSeen) {
      markDevModeHintSeen();
    }
  }, [
    clearDevModeHintTimers,
    hasDevModeHintBeenSeen,
    isTerminalOpen,
    markDevModeHintSeen,
  ]);

  useEffect(() => {
    clearDevModeHintTimers();

    const canShowHint =
      isHintDesktopCapable &&
      !hasDevModeHintBeenSeen &&
      !isTerminalOpen &&
      !isHintSuppressedRoute;

    if (!canShowHint) {
      setIsDevModeHintVisible(false);
      return undefined;
    }

    hintShowTimerRef.current = setTimeout(() => {
      setIsDevModeHintVisible(true);
      hintShowTimerRef.current = null;

      hintHideTimerRef.current = setTimeout(() => {
        setIsDevModeHintVisible(false);
        markDevModeHintSeen();
        hintHideTimerRef.current = null;
      }, DEV_MODE_HINT_VISIBLE_MS);
    }, DEV_MODE_HINT_SHOW_DELAY_MS);

    return clearDevModeHintTimers;
  }, [
    clearDevModeHintTimers,
    hasDevModeHintBeenSeen,
    isHintDesktopCapable,
    isHintSuppressedRoute,
    isTerminalOpen,
    markDevModeHintSeen,
  ]);

  useEffect(
    () => () => {
      clearDevModeHintTimers();
    },
    [clearDevModeHintTimers]
  );

  const handleDevModeHintClick = useCallback(() => {
    clearDevModeHintTimers();
    setIsDevModeHintVisible(false);
    if (!hasDevModeHintBeenSeen) {
      markDevModeHintSeen();
    }
    onOpenTerminal?.();
  }, [
    clearDevModeHintTimers,
    hasDevModeHintBeenSeen,
    markDevModeHintSeen,
    onOpenTerminal,
  ]);

  const shouldRenderDevModeHint =
    isHintDesktopCapable && !isHintSuppressedRoute && !isTerminalOpen && !hasDevModeHintBeenSeen;

  return (
    <>
      <header className="fixed-top site__header">
        <div className="d-flex align-items-center justify-content-between">
          <Link to="/" className="navbar-brand nav_ac" aria-label={`${logotext} home`}>
            <span className="brand_identity">
              <img src={brandImage} alt={logotext} className="brand_avatar" />
              <span className="brand_text_wrap">
                <span className="brand_text">{logotext}</span>
              </span>
            </span>
          </Link>

          <nav className="header_quick_links" aria-label="Quick links">
            <Link to="/resume" className="header_quick_link">
              Resume
            </Link>
            <Link to="/about" className="header_quick_link">
              About
            </Link>
            <Link to="/contact" className="header_quick_link">
              Contact
            </Link>
          </nav>

          <div className="d-flex align-items-center header_controls">
            <Themetoggle />
            {shouldRenderDevModeHint ? (
              <div className="terminal_hint_slot" aria-hidden={!isDevModeHintVisible}>
                <button
                  type="button"
                  className={`terminal_hint_chip ${
                    isDevModeHintVisible ? "is-visible" : ""
                  }`}
                  onClick={handleDevModeHintClick}
                  tabIndex={isDevModeHintVisible ? 0 : -1}
                  aria-label="Open dev mode terminal (Cmd or Ctrl K)"
                >
                  <span className="terminal_hint_base">Press ⌘K for</span>
                  <span className="terminal_hint_token" aria-hidden="true">
                    {"<dev mode>"}
                  </span>
                </button>
              </div>
            ) : null}
            <button className="menu__button nav_ac" onClick={handleToggle}>
              {!isActive ? <VscClose /> : <VscGrabber />}
            </button>
          </div>
        </div>

        <div className={`site__navigation ${!isActive ? "menu__opend" : ""}`}>
          <div className="bg__menu h-100">
            <div className="menu__wrapper">
              <div className="menu__container p-3">
                <ul className="the_menu">
                  <li className="menu_item ">
                    <Link onClick={handleToggle} to="/" className="my-3">
                      Home
                    </Link>
                  </li>
                  <li className="menu_item">
                    <Link onClick={handleToggle} to="/about" className="my-3">
                      About
                    </Link>
                  </li>
                  <li className="menu_item">
                    <Link onClick={handleToggle} to="/resume" className="my-3">
                      Resume
                    </Link>
                  </li>
                  <li className="menu_item">
                    <Link onClick={handleToggle} to="/contact" className="my-3">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="menu_footer d-flex flex-column flex-md-row justify-content-between align-items-md-center position-absolute w-100 p-3">
            <div className="d-flex">
              <a href={socialprofils.facebook}>Facebook</a>
              <a href={socialprofils.twitter}>Twitter</a>
              <a href={socialprofils.instagram}>Instagram</a>
              <a href={socialprofils.linkedin}>LinkedIn</a>
            </div>
            <p className="copyright m-0">© {new Date().getFullYear()} {logotext}</p>
          </div>
        </div>
      </header>
      <div className="br-top"></div>
      <div className="br-bottom"></div>
      <div className="br-left"></div>
      <div className="br-right"></div>
    </>
  );
};

export default Headermain;
