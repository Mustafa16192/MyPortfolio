import React, { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Link, useLocation } from "react-router-dom";
import { meta } from "../../content_option";
import { PmTerminalShell } from "../../components/pm_terminal";
import "./style.css";

const getDesktopTerminalCapable = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return false;
  }

  const desktopWidth = window.matchMedia("(min-width: 992px)").matches;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  return desktopWidth && !coarsePointer;
};

export const TerminalPage = () => {
  const location = useLocation();
  const [desktopCapable, setDesktopCapable] = useState(() => getDesktopTerminalCapable());

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return undefined;
    }

    const widthMq = window.matchMedia("(min-width: 992px)");
    const pointerMq = window.matchMedia("(pointer: coarse)");

    const sync = () => {
      setDesktopCapable(widthMq.matches && !pointerMq.matches);
    };

    sync();

    if (widthMq.addEventListener) {
      widthMq.addEventListener("change", sync);
      pointerMq.addEventListener("change", sync);
      return () => {
        widthMq.removeEventListener("change", sync);
        pointerMq.removeEventListener("change", sync);
      };
    }

    widthMq.addListener(sync);
    pointerMq.addListener(sync);
    return () => {
      widthMq.removeListener(sync);
      pointerMq.removeListener(sync);
    };
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") {
      return undefined;
    }

    document.body.classList.add("pm-terminal-route-open");
    return () => {
      document.body.classList.remove("pm-terminal-route-open");
    };
  }, []);

  const routePath = `${location.pathname}${location.hash || ""}`;

  return (
    <HelmetProvider>
      <div className="pm_terminal_route_surface">
        <Helmet>
          <meta charSet="utf-8" />
          <title>PM Terminal | {meta.title}</title>
          <meta
            name="description"
            content="Hidden PM Terminal easter egg on Mustafa Ali Mirza's portfolio."
          />
        </Helmet>

        <div className="pm_terminal_route_topbar">
          <div className="pm_terminal_route_badge">Hidden Route</div>
          <div className="pm_terminal_route_actions">
            <Link to="/" className="pm_terminal_route_link">
              Back Home
            </Link>
            <Link to="/contact" className="pm_terminal_route_link">
              Contact
            </Link>
          </div>
        </div>

        {desktopCapable ? (
          <PmTerminalShell mode="page" initialPath={routePath} />
        ) : (
          <div className="pm_terminal_mobile_fallback" role="region" aria-label="PM Terminal desktop-only message">
            <div className="pm_terminal_mobile_eyebrow">PM Terminal</div>
            <h1 className="pm_terminal_mobile_title">Best experienced on desktop.</h1>
            <p className="pm_terminal_mobile_copy">
              This easter egg is built around a keyboard-first terminal flow. Open it on a laptop
              or desktop and use <code>Cmd/Ctrl + K</code>, or revisit <code>/terminal</code>.
            </p>
            <div className="pm_terminal_mobile_actions">
              <Link to="/" className="pm_terminal_mobile_btn">
                Go Home
              </Link>
              <Link to="/about" className="pm_terminal_mobile_btn pm_terminal_mobile_btn_secondary">
                About
              </Link>
            </div>
          </div>
        )}
      </div>
    </HelmetProvider>
  );
};

export default TerminalPage;
