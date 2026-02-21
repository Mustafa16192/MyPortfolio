import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom";
import withRouter from "../hooks/withRouter";
import AppRoutes from "./routes";
import Headermain from "../header";
import AnimatedCursor from "../hooks/AnimatedCursor";
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
          <div className="framer_badge" aria-hidden="true">
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
        </ScrollToTop>
      </div>
    </Router>
  );
}
