import React, { useCallback, useState } from "react";
import "./style.css";

export const SquirrelHover = ({ text = "University of Michigan", className = "" }) => {
  const [isActive, setIsActive] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const classes = ["squirrel-hover", className].filter(Boolean).join(" ");

  const triggerAnimation = useCallback(() => {
    setIsActive(true);
    setIsAnimating(false);
    window.requestAnimationFrame(() => setIsAnimating(true));
  }, []);

  const endAnimation = useCallback(() => {
    setIsActive(false);
    setIsAnimating(false);
  }, []);

  const handleAnimationEnd = useCallback((event) => {
    if (event.target !== event.currentTarget) {
      return;
    }
    setIsAnimating(false);
  }, []);

  return (
    <span
      className={classes}
      onMouseEnter={triggerAnimation}
      onMouseLeave={endAnimation}
      onTouchStart={triggerAnimation}
      onTouchEnd={endAnimation}
      onTouchCancel={endAnimation}
    >
      <span className="squirrel-hover__text">{text}</span>

      <svg
        className={`squirrel-wrapper ${isActive ? "is-active" : ""} ${isAnimating ? "is-animating" : ""}`.trim()}
        viewBox="0 0 220 160"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        onAnimationEnd={handleAnimationEnd}
      >
        <g className="squirrel-body">
          <path
            d="M65 120 C -5 110, -5 20, 40 15 C 60 10, 85 25, 90 50 C 100 80, 85 110, 75 120 Z"
            fill="#7A4827"
            className="squirrel-tail"
          />
          <path
            d="M35 85 C 10 55, 25 25, 45 20"
            fill="none"
            stroke="#965D38"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M50 100 C 25 75, 40 40, 60 35"
            fill="none"
            stroke="#965D38"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path d="M75 120 C 65 65, 145 65, 135 120 Z" fill="#965D38" />
          <path d="M90 120 C 85 80, 125 80, 120 120 Z" fill="#E6C8A6" />
          <path
            d="M 85 80 C 85 55, 145 55, 145 80 C 150 95, 135 95, 135 95 L 90 95 C 90 95, 80 95, 85 80 Z"
            fill="#001529"
          />
          <path
            d="M 71 110 C 65 85, 80 85, 95 85 L 108 95 L 121 85 C 136 85, 148 85, 139 110 C 125 118, 85 118, 71 110 Z"
            fill="#00274C"
          />
          <line
            x1="108"
            y1="95"
            x2="108"
            y2="114"
            stroke="#001529"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M 69 98 Q 108 103 141 98" stroke="#001529" strokeWidth="1.5" fill="none" />
          <path d="M 70 108 Q 108 113 140 108" stroke="#001529" strokeWidth="1.5" fill="none" />
          <path
            d="M 75 92 C 75 86, 82 86, 88 88"
            stroke="#1A4A7A"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
          <path
            d="M 138 102 C 138 96, 130 96, 125 96"
            stroke="#1A4A7A"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            opacity="0.6"
          />
          <polyline
            points="123,94 123,89 125.5,92 128,89 128,94"
            stroke="#FFCB05"
            strokeWidth="1.5"
            fill="none"
            strokeLinejoin="miter"
          />
          <path d="M90 60 C 90 35, 150 35, 150 60 C 150 82, 138 90, 120 90 C 102 90, 90 82, 90 60 Z" fill="#965D38" />
          <path d="M102 45 L 108 25 L 115 40" fill="#7A4827" />
          <path d="M125 40 L 132 25 L 138 45" fill="#7A4827" />
          <path d="M105 43 L 109 30 L 113 40" fill="#E6C8A6" />
          <path d="M127 40 L 131 30 L 135 43" fill="#E6C8A6" />
          <path d="M105 72 C 105 65, 135 65, 135 72 C 135 85, 125 88, 120 88 C 115 88, 105 85, 105 72 Z" fill="#E6C8A6" />

          <g className="blush" opacity="0">
            <ellipse cx="102" cy="74" rx="6" ry="4" fill="#FF8888" />
            <ellipse cx="138" cy="74" rx="6" ry="4" fill="#FF8888" />
          </g>

          <g className="eyes">
            <ellipse cx="106" cy="61" rx="5.5" ry="7" fill="#FFFFFF" />
            <ellipse cx="134" cy="61" rx="5.5" ry="7" fill="#FFFFFF" />

            <g className="pupils">
              <ellipse cx="106" cy="61" rx="4.5" ry="5.5" fill="#111111" />
              <ellipse cx="134" cy="61" rx="4.5" ry="5.5" fill="#111111" />
              <circle cx="104.5" cy="59.5" r="1.5" fill="#FFFFFF" />
              <circle cx="132.5" cy="59.5" r="1.5" fill="#FFFFFF" />
            </g>
          </g>

          <path d="M117 71 Q 120 73 123 71 L 120 74 Z" fill="#2A1810" />
          <path
            d="M116 77 Q 120 81 124 77"
            stroke="#2A1810"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />

          <path d="M 78 85 C 65 100, 95 105, 102 96 C 104 90, 95 82, 78 85 Z" fill="#00274C" />
          <line x1="99" y1="94" x2="103" y2="98" stroke="#001529" strokeWidth="3" strokeLinecap="round" />
          <path d="M 138 85 C 150 100, 125 105, 134 96 C 136 90, 130 82, 138 85 Z" fill="#00274C" />
          <line x1="135" y1="94" x2="131" y2="98" stroke="#001529" strokeWidth="3" strokeLinecap="round" />

          <g className="acorn" transform="translate(-6, 5)">
            <path d="M112 85 Q120 105 128 85 Z" fill="#D4A373" />
            <path d="M108 85 Q114 80 120 83 Q126 80 132 85 Z" fill="#8B5A2B" />
            <line
              x1="120"
              y1="81"
              x2="120"
              y2="75"
              stroke="#8B5A2B"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </g>

          <g className="paws">
            <ellipse cx="106" cy="94" rx="6" ry="9" fill="#7A4827" transform="rotate(-15, 106, 94)" />
            <ellipse
              className="waving-paw"
              cx="134"
              cy="94"
              rx="6"
              ry="9"
              fill="#7A4827"
              transform="rotate(-60, 134, 94)"
              style={{ transformOrigin: "134px 94px" }}
            />
          </g>
        </g>
      </svg>
    </span>
  );
};
