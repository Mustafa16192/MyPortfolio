import React, { useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setupPremiumTiltCards } from "../../utils/premiumTiltCards";
import "./style.css";

const PRINCIPLE_TAG_LABELS = {
  research: "Research",
  delivery: "Delivery",
  strategy: "Strategy",
  collaboration: "Collab",
  quality: "Quality",
  growth: "Growth",
};

export const OperatingPrinciples = ({ items = [] }) => {
  const rootRef = useRef(null);
  const [activeId, setActiveId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useLayoutEffect(() => {
    if (!rootRef.current || !items.length) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const supportsFineHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    let cleanupTilt = () => {};

    const ctx = gsap.context(() => {
      const cards = Array.from(
        rootRef.current.querySelectorAll(".operating-principles__card")
      );
      if (!cards.length) {
        return;
      }

      if (prefersReducedMotion) {
        gsap.set(cards, { clearProps: "opacity,visibility,transform" });
        return;
      }

      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.28,
          ease: "power2.out",
          stagger: 0.04,
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 88%",
            once: true,
          },
        }
      );

      if (supportsFineHover && !prefersReducedMotion) {
        cleanupTilt = setupPremiumTiltCards(cards, {
          maxRotateX: 3.6,
          maxRotateY: 4.4,
        });
      }
    }, rootRef);

    return () => {
      cleanupTilt();
      ctx.revert();
    };
  }, [items]);

  if (!items.length) {
    return null;
  }

  return (
    <section
      ref={rootRef}
      className="operating-principles"
      aria-labelledby="operating-principles-title"
    >
      <div className="operating-principles__header">
        <h2 id="operating-principles-title">Operating Principles</h2>
        <p className="operating-principles__eyebrow">How I work</p>
      </div>

      <ul
        className="operating-principles__grid"
        onMouseLeave={() => setHoveredId(null)}
      >
        {items.map((item) => {
          const isExpanded = hoveredId === item.id || activeId === item.id;
          const tagLabel = PRINCIPLE_TAG_LABELS[item.tag] || "Principle";

          return (
            <li key={item.id} className="operating-principles__item">
              <button
                type="button"
                className={`operating-principles__card ${
                  isExpanded ? "is-expanded" : ""
                }`.trim()}
                onClick={() =>
                  setActiveId((prev) => (prev === item.id ? null : item.id))
                }
                onMouseEnter={() => setHoveredId(item.id)}
                aria-expanded={isExpanded}
              >
                <span className="operating-principles__topline">
                  <span className="operating-principles__tag">{tagLabel}</span>
                </span>
                <span className="operating-principles__principle">
                  {item.principle}
                </span>
                <span className="operating-principles__example">
                  {item.example}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
