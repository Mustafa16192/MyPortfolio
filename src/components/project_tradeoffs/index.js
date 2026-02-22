import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";

const getDefaultOpenItemId = (items) => {
  if (!items.length) {
    return null;
  }
  if (typeof window === "undefined") {
    return items[0].id;
  }
  return window.innerWidth >= 992 ? items[0].id : null;
};

export const ProjectTradeoffs = ({ projectId, items = [] }) => {
  const rootRef = useRef(null);
  const visibleItems = useMemo(() => items.slice(0, 3), [items]);
  const [openTradeoffId, setOpenTradeoffId] = useState(() =>
    getDefaultOpenItemId(visibleItems)
  );

  useEffect(() => {
    setOpenTradeoffId(getDefaultOpenItemId(visibleItems));
  }, [projectId, visibleItems]);

  useLayoutEffect(() => {
    if (!rootRef.current || !visibleItems.length) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(rootRef.current, { clearProps: "opacity,visibility,transform" });
        return;
      }

      gsap.fromTo(
        rootRef.current,
        { autoAlpha: 0, y: 10 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.28,
          ease: "power2.out",
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 88%",
            once: true,
          },
        }
      );
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, [visibleItems]);

  if (!visibleItems.length) {
    return null;
  }

  return (
    <section
      ref={rootRef}
      className="project-tradeoffs"
      aria-labelledby={`project-tradeoffs-title-${projectId}`}
    >
      <div className="project-tradeoffs__header">
        <h3
          id={`project-tradeoffs-title-${projectId}`}
          className="color_sec py-3 display-6"
        >
          Tradeoffs & Decisions
        </h3>
        <p className="project-tradeoffs__intro">
          The choices that shaped scope, rollout, and product behavior under real constraints.
        </p>
      </div>

      <div className="project-tradeoffs__list">
        {visibleItems.map((item, index) => {
          const isOpen = openTradeoffId === item.id;
          const panelId = `tradeoff-panel-${projectId}-${item.id}`;
          const buttonId = `tradeoff-button-${projectId}-${item.id}`;

          return (
            <article
              key={item.id}
              className={`project-tradeoffs__item ${isOpen ? "is-open" : ""}`.trim()}
            >
              <button
                id={buttonId}
                type="button"
                className="project-tradeoffs__trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() =>
                  setOpenTradeoffId((prev) => (prev === item.id ? null : item.id))
                }
              >
                <span className="project-tradeoffs__trigger-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="project-tradeoffs__trigger-copy">
                  <span className="project-tradeoffs__trigger-title">
                    {item.title}
                  </span>
                  <span className="project-tradeoffs__trigger-subtitle">
                    {item.options}
                  </span>
                </span>
                <span className="project-tradeoffs__trigger-icon" aria-hidden="true">
                  +
                </span>
              </button>

              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                aria-hidden={!isOpen}
                className="project-tradeoffs__panel"
              >
                <div className="project-tradeoffs__panel-inner">
                  <div className="project-tradeoffs__row">
                    <h4>Decision</h4>
                    <p>{item.decision}</p>
                  </div>
                  <div className="project-tradeoffs__row">
                    <h4>Reason</h4>
                    <p>{item.reason}</p>
                  </div>
                  <div className="project-tradeoffs__row">
                    <h4>Impact</h4>
                    <p>{item.impact}</p>
                  </div>
                  {item.confidence && (
                    <div className="project-tradeoffs__meta">
                      <span className="project-tradeoffs__pill">
                        Confidence: {item.confidence}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};
