import React, { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import {
  meta,
  dataportfolio,
} from "../../content_option";
import { Link, useLocation, useNavigationType } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SquirrelHover } from "../../components/squirrel_hover";
import {
  clearHomeProjectReturnScroll,
  readHomeProjectReturnScroll,
  saveHomeProjectReturnScroll,
} from "../../utils/homeScrollRestore";

const featuredProjects = dataportfolio;

export const Home = () => {
  const location = useLocation();
  const navigationType = useNavigationType();
  const pendingReturnSnapshot = readHomeProjectReturnScroll();
  const hasExplicitRestoreFlag = location.state?.restoreHomeProjectScroll === true;
  const isHistoryReturn = navigationType === "POP";
  const isProjectReturnRestoreFlow =
    Boolean(pendingReturnSnapshot) &&
    (hasExplicitRestoreFlag || isHistoryReturn);
  const homeRef = useRef(null);
  const heroRef = useRef(null);
  const eyebrowRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const proofRef = useRef(null);
  const featuredRef = useRef(null);
  const featuredHeaderRef = useRef(null);
  const featuredListRef = useRef(null);

  const handleProjectCardClick = useCallback((projectId, event) => {
    const clickButton =
      typeof event?.button === "number"
        ? event.button
        : typeof event?.nativeEvent?.button === "number"
          ? event.nativeEvent.button
          : null;

    if (
      !event ||
      event.defaultPrevented ||
      (clickButton !== null && clickButton !== 0) ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    saveHomeProjectReturnScroll({
      y: window.scrollY,
      projectId,
    });
  }, []);

  useEffect(() => {
    if (!pendingReturnSnapshot || !isProjectReturnRestoreFlow) {
      return undefined;
    }

    clearHomeProjectReturnScroll();
    return undefined;
  }, [isProjectReturnRestoreFlow, pendingReturnSnapshot]);

  useLayoutEffect(() => {
    if (
      !homeRef.current ||
      !heroRef.current ||
      !eyebrowRef.current ||
      !titleRef.current ||
      !subtitleRef.current ||
      !proofRef.current ||
      !featuredRef.current ||
      !featuredListRef.current
    ) {
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.matchMedia("(max-width: 991px)").matches;
    const supportsFineHover = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    const canUseProofTilt = !prefersReducedMotion && !isMobile && supportsFineHover;
    const proofItems = Array.from(
      proofRef.current.querySelectorAll(".hero_proof_item")
    );
    const featuredRows = Array.from(
      featuredListRef.current.querySelectorAll(".featured_project_row")
    );
    const featuredRect = featuredRef.current.getBoundingClientRect();
    const shouldIntroFeatured =
      featuredRect.top <=
      window.innerHeight * (isMobile ? 1.06 : 1.12);
    const isProjectReturnRestore = isProjectReturnRestoreFlow;
    let cleanupProofTilt = () => {};
    let cleanupFeaturedTilt = () => {};

    const setProjectFocus = (isProjectFocused) => {
      document.body.classList.toggle("is-project-focus", isProjectFocused);
    };
    const setProjectFocusProgress = (rawProgress) => {
      const clamped = gsap.utils.clamp(0, 1, rawProgress);
      document.body.style.setProperty("--project-focus", clamped.toFixed(3));
      setProjectFocus(clamped > 0.08);
    };
    const clearProjectFocus = () => {
      setProjectFocus(false);
      document.body.style.removeProperty("--project-focus");
    };

    const setupProofTilt = (cards) => {
      const maxRotateX = 4;
      const maxRotateY = 5;
      const easing = 0.16;
      const defaultEdgeAlpha = 0.05;
      const defaultSpecAlpha = 0.08;

      const cardStates = cards.map((card) => {
        const state = {
          card,
          targetX: 0,
          targetY: 0,
          currentX: 0,
          currentY: 0,
          targetLX: 50,
          targetLY: 50,
          currentLX: 50,
          currentLY: 50,
          targetEdge: defaultEdgeAlpha,
          currentEdge: defaultEdgeAlpha,
          targetSpec: defaultSpecAlpha,
          currentSpec: defaultSpecAlpha,
          targetSpark: 0,
          currentSpark: 0,
          rafId: 0,
        };

        card.style.setProperty("--lx", "50%");
        card.style.setProperty("--ly", "50%");
        card.style.setProperty("--edge-alpha", String(defaultEdgeAlpha));
        card.style.setProperty("--spec-alpha", String(defaultSpecAlpha));
        card.style.setProperty("--spark-shift", "0%");

        const stopFrame = () => {
          if (state.rafId) {
            cancelAnimationFrame(state.rafId);
            state.rafId = 0;
          }
        };

        const animate = () => {
          state.currentX += (state.targetX - state.currentX) * easing;
          state.currentY += (state.targetY - state.currentY) * easing;
          state.currentLX += (state.targetLX - state.currentLX) * easing;
          state.currentLY += (state.targetLY - state.currentLY) * easing;
          state.currentEdge += (state.targetEdge - state.currentEdge) * easing;
          state.currentSpec += (state.targetSpec - state.currentSpec) * easing;
          state.currentSpark += (state.targetSpark - state.currentSpark) * easing;

          const nearTiltTarget =
            Math.abs(state.targetX - state.currentX) < 0.02 &&
            Math.abs(state.targetY - state.currentY) < 0.02;
          const nearLightTarget =
            Math.abs(state.targetLX - state.currentLX) < 0.08 &&
            Math.abs(state.targetLY - state.currentLY) < 0.08 &&
            Math.abs(state.targetEdge - state.currentEdge) < 0.003 &&
            Math.abs(state.targetSpec - state.currentSpec) < 0.003 &&
            Math.abs(state.targetSpark - state.currentSpark) < 0.05;

          if (nearTiltTarget) {
            state.currentX = state.targetX;
            state.currentY = state.targetY;
          }
          if (nearLightTarget) {
            state.currentLX = state.targetLX;
            state.currentLY = state.targetLY;
            state.currentEdge = state.targetEdge;
            state.currentSpec = state.targetSpec;
            state.currentSpark = state.targetSpark;
          }

          if (Math.abs(state.currentX) < 0.01 && Math.abs(state.currentY) < 0.01) {
            state.card.style.transform = "";
          } else {
            state.card.style.transform = `perspective(980px) rotateX(${state.currentX.toFixed(
              3
            )}deg) rotateY(${state.currentY.toFixed(3)}deg)`;
          }
          state.card.style.setProperty("--lx", `${state.currentLX.toFixed(2)}%`);
          state.card.style.setProperty("--ly", `${state.currentLY.toFixed(2)}%`);
          state.card.style.setProperty("--edge-alpha", state.currentEdge.toFixed(3));
          state.card.style.setProperty("--spec-alpha", state.currentSpec.toFixed(3));
          state.card.style.setProperty(
            "--spark-shift",
            `${state.currentSpark.toFixed(2)}%`
          );

          if (
            nearTiltTarget &&
            nearLightTarget &&
            state.targetX === 0 &&
            state.targetY === 0
          ) {
            state.card.classList.remove("is-tilting");
            stopFrame();
            return;
          }

          state.rafId = requestAnimationFrame(animate);
        };

        const startFrame = () => {
          if (!state.rafId) {
            state.rafId = requestAnimationFrame(animate);
          }
        };

        const handlePointerMove = (event) => {
          const bounds = state.card.getBoundingClientRect();
          const relativeX = (event.clientX - bounds.left) / bounds.width;
          const relativeY = (event.clientY - bounds.top) / bounds.height;
          const clampedX = Math.min(Math.max(relativeX, 0), 1);
          const clampedY = Math.min(Math.max(relativeY, 0), 1);
          const dx = clampedX - 0.5;
          const dy = clampedY - 0.5;
          const distanceFromCenter = Math.min(
            1,
            Math.sqrt(dx * dx + dy * dy) * 1.7
          );

          state.targetY = dx * maxRotateY * 2;
          state.targetX = -dy * maxRotateX * 2;
          state.targetLX = clampedX * 100;
          state.targetLY = clampedY * 100;
          state.targetEdge = 0.06 + distanceFromCenter * 0.16;
          state.targetSpec =
            0.09 + Math.min(1, (Math.abs(state.targetX) + Math.abs(state.targetY)) / 18) * 0.18;
          state.targetSpark = dx * 7;
          state.card.classList.add("is-tilting");
          startFrame();
        };

        const handlePointerEnter = (event) => {
          handlePointerMove(event);
        };

        const handlePointerLeave = () => {
          state.targetX = 0;
          state.targetY = 0;
          state.targetLX = 50;
          state.targetLY = 50;
          state.targetEdge = defaultEdgeAlpha;
          state.targetSpec = defaultSpecAlpha;
          state.targetSpark = 0;
          startFrame();
        };

        state.handlePointerEnter = handlePointerEnter;
        state.handlePointerMove = handlePointerMove;
        state.handlePointerLeave = handlePointerLeave;

        card.addEventListener("pointerenter", handlePointerEnter);
        card.addEventListener("pointermove", handlePointerMove);
        card.addEventListener("pointerleave", handlePointerLeave);

        return state;
      });

      return () => {
        cardStates.forEach((state) => {
          state.card.removeEventListener("pointerenter", state.handlePointerEnter);
          state.card.removeEventListener("pointermove", state.handlePointerMove);
          state.card.removeEventListener("pointerleave", state.handlePointerLeave);
          if (state.rafId) {
            cancelAnimationFrame(state.rafId);
          }
          state.card.classList.remove("is-tilting");
          state.card.style.transform = "";
          state.card.style.removeProperty("--lx");
          state.card.style.removeProperty("--ly");
          state.card.style.removeProperty("--edge-alpha");
          state.card.style.removeProperty("--spec-alpha");
          state.card.style.removeProperty("--spark-shift");
        });
      };
    };

    if (prefersReducedMotion) {
      gsap.set(
        [eyebrowRef.current, titleRef.current, subtitleRef.current, ...proofItems],
        { clearProps: "opacity,transform" }
      );
      clearProjectFocus();
      return () => clearProjectFocus();
    }

    const ctx = gsap.context(() => {
      const introY = isMobile
        ? { eyebrow: 8, title: 12, subtitle: 10, proof: 14 }
        : { eyebrow: 10, title: 14, subtitle: 12, proof: 18 };

      if (isProjectReturnRestore) {
        gsap.set(
          [eyebrowRef.current, titleRef.current, subtitleRef.current, ...proofItems],
          { opacity: 1, y: 0, clearProps: "transform" }
        );
        gsap.set(featuredHeaderRef.current, { opacity: 1, y: 0 });
        gsap.set(featuredRows, { opacity: 1, y: 0 });

        if (!prefersReducedMotion) {
          const returnTimeline = gsap.timeline({
            defaults: { ease: "power2.out" },
          });

          returnTimeline
            .fromTo(
              featuredHeaderRef.current,
              { opacity: 0.92, y: isMobile ? 4 : 6 },
              { opacity: 1, y: 0, duration: 0.2 }
            )
            .fromTo(
              featuredRows,
              { opacity: 0.94, y: isMobile ? 6 : 8 },
              {
                opacity: 1,
                y: 0,
                duration: 0.24,
                stagger: 0.015,
              },
              0.02
            );

          if (canUseProofTilt) {
            returnTimeline.eventCallback("onComplete", () => {
              cleanupProofTilt = setupProofTilt(proofItems);
              cleanupFeaturedTilt = setupProofTilt(featuredRows);
            });
          }
        } else if (canUseProofTilt) {
          cleanupProofTilt = setupProofTilt(proofItems);
          cleanupFeaturedTilt = setupProofTilt(featuredRows);
        }
      } else {
        gsap.set(eyebrowRef.current, { opacity: 0, y: introY.eyebrow });
        gsap.set(titleRef.current, { opacity: 0, y: introY.title });
        gsap.set(subtitleRef.current, { opacity: 0, y: introY.subtitle });
        gsap.set(proofItems, { opacity: 0, y: introY.proof });
        if (shouldIntroFeatured) {
          gsap.set(featuredHeaderRef.current, {
            opacity: 0,
            y: isMobile ? 10 : 12,
          });
          gsap.set(featuredRows, {
            opacity: 0,
            y: isMobile ? 12 : 16,
          });
        }

        const introTimeline = gsap
          .timeline({
            defaults: { ease: "power2.out" },
            delay: 0.08,
          })
          .to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.42 })
          .to(titleRef.current, { opacity: 1, y: 0, duration: 0.5 }, "-=0.18")
          .to(subtitleRef.current, { opacity: 1, y: 0, duration: 0.42 }, "-=0.26")
          .addLabel("proofStart", "-=0.16")
          .to(
            proofItems,
            {
              opacity: 1,
              y: 0,
              duration: 0.4,
              stagger: 0.08,
            },
            "proofStart"
          );

        if (shouldIntroFeatured) {
          introTimeline
            .to(
              featuredHeaderRef.current,
              {
                opacity: 1,
                y: 0,
                duration: 0.28,
              },
              "proofStart"
            )
            .to(
              featuredRows,
              {
                opacity: 1,
                y: 0,
                duration: 0.3,
                stagger: 0.018,
              },
              "proofStart"
            );
        }

        if (canUseProofTilt) {
          introTimeline.eventCallback("onComplete", () => {
            cleanupProofTilt = setupProofTilt(proofItems);
            cleanupFeaturedTilt = setupProofTilt(featuredRows);
          });
        }
      }

      if (isMobile) {
        ScrollTrigger.create({
          trigger: featuredRef.current,
          start: "top 78%",
          end: "top 40%",
          onEnter: () => setProjectFocus(true),
          onEnterBack: () => setProjectFocus(true),
          onLeaveBack: () => setProjectFocus(false),
        });

        gsap.fromTo(
          featuredRef.current,
          { y: 22, opacity: 0.92 },
          {
            y: 0,
            opacity: 1,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: {
              trigger: featuredRef.current,
              start: "top 90%",
              end: "top 62%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
        return;
      }

      gsap.set(heroRef.current, { transformOrigin: "50% 18%" });
      gsap.set(featuredRef.current, { transformOrigin: "50% 0%" });

      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: featuredRef.current,
            start: "top 86%",
            end: "top 20%",
            scrub: true,
            onUpdate: (self) => setProjectFocusProgress(self.progress),
            onLeaveBack: () => setProjectFocusProgress(0),
          },
        })
        .fromTo(
          featuredRef.current,
          { y: 70, scale: 0.965, opacity: 0.8 },
          { y: 0, scale: 1, opacity: 1 },
          0
        )
        .to(heroRef.current, { y: -38, scale: 0.96, opacity: 0.52 }, 0);
    }, homeRef);

    return () => {
      clearProjectFocus();
      cleanupProofTilt();
      cleanupFeaturedTilt();
      ctx.revert();
    };
  }, []);

  return (
    <HelmetProvider>
      <section
        id="home"
        className="home"
        ref={homeRef}
      >
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <div className={`home_shell ${isProjectReturnRestoreFlow ? "home_shell--returning" : ""}`.trim()}>
          <div className="home_hero home_hero_anim" ref={heroRef}>
            <p className="home_eyebrow" ref={eyebrowRef}>
              <span className="status_dot" aria-hidden="true"></span>
              <span className="status_text">
                <span className="status_old">Learning</span>{" "}
                <span className="status_new">Building</span>stuff in UMich 〽️
              </span>
            </p>
            <h1 className="home_title" ref={titleRef}>
              AI-driven Product Manager who speaks engineering
              <span className="home_title_emoji" aria-hidden="true">🧑‍💻</span>
            </h1>
            <p className="home_subtitle" ref={subtitleRef}>
              I turn ambiguity into shipped products and{" "}
              <span className="home_subtitle_tail">business lift 🚀</span>
            </p>

            <div className="hero_proof" ref={proofRef}>
              <p className="hero_proof_item">
                <span className="hero_proof_text">$2M+ monthly revenue impact through shipped product systems</span>
              </p>
              <p className="hero_proof_item">
                <span className="hero_proof_text">Led product execution across automotive, fintech, and classifieds</span>
              </p>
              <p className="hero_proof_item">
                <span className="hero_proof_text">
                  Admitted to the <SquirrelHover text="University of Michigan" className="hero_umich_hover" /> School of Information
                </span>
              </p>
            </div>
          </div>

          <section
            id="projects"
            className="featured_projects featured_projects_anim"
            aria-label="Featured projects"
            ref={featuredRef}
          >
            <div className="featured_projects_header" ref={featuredHeaderRef}>
              <h2>Featured Projects</h2>
            </div>

            <div className="featured_projects_list" ref={featuredListRef}>
              {featuredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/project/${project.id}`}
                  state={{ fromHomeProjects: true, projectId: project.id }}
                  className="featured_project_row"
                  data-project-id={project.id}
                  aria-label={`Open ${project.title}`}
                  onClick={(event) => handleProjectCardClick(project.id, event)}
                >
                  <div className="featured_project_media">
                    <img
                      src={require(`../../assets/images/${project.img}`)}
                      alt={project.title}
                      loading="lazy"
                    />
                  </div>
                  <div className="featured_project_info">
                    <div className="featured_project_meta_row">
                      <span className="featured_project_glance">
                        <span className="featured_project_emoji" aria-hidden="true">
                          {project.emoji || "✨"}
                        </span>
                        <span className="featured_project_domain">
                          {(project.quickGlance && project.quickGlance.length
                            ? project.quickGlance
                            : [project.role || "Product Case Study"]
                          ).join(" • ")}
                        </span>
                      </span>
                    </div>
                    <h3 className="featured_project_title">{project.title}</h3>
                    <p className="featured_project_desc">{project.description}</p>
                    <span className="featured_project_cta">View Case Study ↗</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>
      </section>
    </HelmetProvider>
  );
};
