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

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      themetoggle();
    }
  };

  return (
    <div
      className="nav_ac theme_toggler_btn"
      onClick={themetoggle}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="Toggle theme"
      aria-pressed={theme === "dark"}
    >
      <WiMoonAltWaningCrescent4 />
    </div>
  );
};

export default Themetoggle;
