import React from "react";
import "./style.css";

export const WolverineHover = ({ text = "University of Michigan", className = "" }) => {
  const classes = ["wolverine-hover", className].filter(Boolean).join(" ");

  return (
    <span className={classes}>
      <span className="wolverine-hover__text">{text}</span>

      <svg
        className="wolverine-hover__anim"
        viewBox="0 0 200 150"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g className="wolverine-hover__body">
          <path
            d="M50 100 Q100 50 150 100 Q150 130 100 130 Q50 130 50 100"
            fill="#00274C"
          />
          <path d="M70 105 Q100 70 130 105 Q100 120 70 105" fill="#FFCB05" />
          <circle cx="100" cy="70" r="25" fill="#00274C" />
          <path d="M80 55 Q75 40 85 45" stroke="#FFCB05" strokeWidth="4" fill="none" />
          <path d="M120 55 Q125 40 115 45" stroke="#FFCB05" strokeWidth="4" fill="none" />
          <path d="M88 68 Q92 72 96 68" stroke="#FFCB05" strokeWidth="2" fill="none" />
          <path d="M104 68 Q108 72 112 68" stroke="#FFCB05" strokeWidth="2" fill="none" />
          <circle cx="100" cy="80" r="4" fill="#FFCB05" />

          <g className="wolverine-hover__paws">
            <circle cx="85" cy="115" r="8" fill="#FFCB05" />
            <circle cx="115" cy="115" r="8" fill="#FFCB05" />
          </g>
        </g>

        <g className="wolverine-hover__acorn">
          <path d="M92 40 Q100 55 108 40 Z" fill="#D4A373" />
          <path d="M88 40 Q100 30 112 40 Z" fill="#8B5A2B" />
          <line x1="100" y1="35" x2="100" y2="28" stroke="#8B5A2B" strokeWidth="2" />
        </g>
      </svg>
    </span>
  );
};
