import React, { useCallback, useMemo, useRef } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import withRouter from "../hooks/withRouter";
import { Home } from "../pages/home";
import { ContactUs } from "../pages/contact";
import { About } from "../pages/about";
import { Resume } from "../pages/resume";
import { ProjectOverview } from "../pages/project_overview";
import APIPage from "../pages/api"; // Import default export from "../pages/api"
import { Socialicons } from "../components/socialicons";
import { AnimatePresence } from "framer-motion";
import { readHomeProjectReturnScroll } from "../utils/homeScrollRestore";

const AnimatedRoutes = withRouter(({ location, onRouteExitComplete }) => (
  <AnimatePresence initial={false} mode="wait" onExitComplete={onRouteExitComplete}>
      <Routes location={location} key={location.pathname}>
        <Route exact path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/api" element={<APIPage />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/portfolio" element={<Navigate to="/" replace />} />
        <Route path="/project/:id" element={<ProjectOverview />} />
        <Route path="*" element={<Home />} />
      </Routes>
  </AnimatePresence>
));

function AppRoutes() {
  const location = useLocation();
  const pendingScrollActionRef = useRef({ type: "none" });
  const lastFlushedKeyRef = useRef("");
  const routeKey = `${location.pathname}${location.hash || ""}`;

  const pendingScrollAction = useMemo(() => {
    const { hash, pathname, state } = location;

    if (pathname === "/") {
      const hasPendingRestore = Boolean(readHomeProjectReturnScroll());
      const shouldSkipTopReset =
        hash === "#projects" ||
        state?.restoreHomeProjectScroll === true ||
        hasPendingRestore;

      if (shouldSkipTopReset) {
        return {
          type: "none",
          routeKey,
        };
      }
    }

    return {
      type: "reset-top",
      routeKey,
    };
  }, [location, routeKey]);

  pendingScrollActionRef.current = pendingScrollAction;

  const handleRouteExitComplete = useCallback(() => {
    const action = pendingScrollActionRef.current;
    if (!action || action.type !== "reset-top") {
      return;
    }

    if (lastFlushedKeyRef.current === action.routeKey) {
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    lastFlushedKeyRef.current = action.routeKey;
  }, []);

  // Check if the current route is either "/api" or "/about" or "/resume"
  const isExcludedPage =
    location.pathname === "/api" ||
    location.pathname === "/about" ||
    location.pathname === "/resume" ||
    location.pathname.startsWith("/project/");

  return (
    <div className="s_c">
      <AnimatedRoutes onRouteExitComplete={handleRouteExitComplete} />
      {/* Conditionally render the Socialicons component */}
      {!isExcludedPage && <Socialicons />}
    </div>
  );
}

export default AppRoutes;
