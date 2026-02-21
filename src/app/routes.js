import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import withRouter from "../hooks/withRouter";
import { Home } from "../pages/home";
import { ContactUs } from "../pages/contact";
import { About } from "../pages/about";
import { Resume } from "../pages/resume";
import { Portfolio } from "../pages/portfolio";
import { ProjectOverview } from "../pages/project_overview";
import APIPage from "../pages/api"; // Import default export from "../pages/api"
import { Socialicons } from "../components/socialicons";
import { AnimatePresence } from "framer-motion";

const AnimatedRoutes = withRouter(({ location }) => (
  <AnimatePresence initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route exact path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/api" element={<APIPage />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/project/:id" element={<ProjectOverview />} />
        <Route path="*" element={<Home />} />
      </Routes>
  </AnimatePresence>
));

function AppRoutes() {
  const location = useLocation();

  // Check if the current route is either "/api" or "/about" or "/resume"
  const isExcludedPage =
    location.pathname === "/api" ||
    location.pathname === "/about" ||
    location.pathname === "/resume";

  return (
    <div className="s_c">
      <AnimatedRoutes />
      {/* Conditionally render the Socialicons component */}
      {!isExcludedPage && <Socialicons />}
    </div>
  );
}

export default AppRoutes;
