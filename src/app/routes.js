import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import withRouter from "../hooks/withRouter";
import { Home } from "../pages/home";
import { ContactUs } from "../pages/contact";
import { About } from "../pages/about";
import { Resume } from "../pages/resume";
import APIPage from "../pages/api"; // Import default export from "../pages/api"
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { Socialicons } from "../components/socialicons";

const AnimatedRoutes = withRouter(({ location }) => (
  <TransitionGroup>
    <CSSTransition
      key={location.key}
      timeout={{
        enter: 400,
        exit: 400,
      }}
      classNames="page"
      unmountOnExit
    >
      <Routes location={location}>
        <Route exact path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/api" element={<APIPage />} />
        <Route path="/resume" element={<Resume />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </CSSTransition>
  </TransitionGroup>
));

function AppRoutes() {
  const location = useLocation();

  // Check if the current route is either "/api" or "/about" or "/resume"
  const isExcludedPage = location.pathname === "/api" || location.pathname === "/about" ||  location.pathname === "/resume";

  return (
    <div className="s_c">
      <AnimatedRoutes />
      {/* Conditionally render the Socialicons component */}
      {!isExcludedPage && <Socialicons />}
    </div>
  );
}

export default AppRoutes;
