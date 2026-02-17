import React, { useEffect, useState } from "react";
import { WiMoonAltWaningCrescent4 } from "react-icons/wi";
import "./style.css";


const Themetoggle = () => {
  const [theme, settheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark" || savedTheme === "light" ? savedTheme : "light";
  });

  const themetoggle = () => {
    settheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="nav_ac theme_toggler_btn" onClick={themetoggle} role="button" aria-label="Toggle theme">
      <WiMoonAltWaningCrescent4 />
    </div>
  );
};

export default Themetoggle;
