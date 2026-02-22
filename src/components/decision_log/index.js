import React, { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";

export const DecisionLog = ({ items = [] }) => {
  const rootRef = useRef(null);

  useLayoutEffect(() => {
    if (!rootRef.current || !items.length) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const cards = rootRef.current.querySelectorAll(".decision-log__card");
      if (!cards.length) {
        return;
      }

      if (prefersReducedMotion) {
        gsap.set(cards, { clearProps: "opacity,visibility,transform" });
        return;
      }

      gsap.fromTo(
        cards,
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out",
          stagger: 0.05,
          clearProps: "opacity,visibility,transform",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, rootRef);

    return () => {
      ctx.revert();
    };
  }, [items]);

  if (!items.length) {
    return null;
  }

  return (
    <section ref={rootRef} className="decision-log" aria-labelledby="decision-log-title">
      <div className="decision-log__header">
        <p className="decision-log__eyebrow">How I decide</p>
        <h2 id="decision-log-title">Decision Log</h2>
      </div>

      <div className="decision-log__grid">
        {items.map((item) => (
          <article key={item.id} className="decision-log__card">
            <div className="decision-log__card-head">
              <h3>{item.title}</h3>
              {item.visibility === "nda-safe" && (
                <span className="decision-log__badge">NDA-safe</span>
              )}
            </div>

            <dl className="decision-log__details">
              <div className="decision-log__row">
                <dt>Context</dt>
                <dd>{item.context}</dd>
              </div>
              <div className="decision-log__row">
                <dt>Constraint</dt>
                <dd>{item.constraint}</dd>
              </div>
              <div className="decision-log__row">
                <dt>Call</dt>
                <dd>{item.call}</dd>
              </div>
              <div className="decision-log__row">
                <dt>Outcome</dt>
                <dd>{item.outcome}</dd>
              </div>
            </dl>

            <div className="decision-log__footer">
              <Link
                to={`/project/${item.projectId}`}
                className="decision-log__cta"
                aria-label={`Open related project: ${item.title}`}
              >
                View Related Project
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
