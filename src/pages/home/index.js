import React, { useLayoutEffect, useRef } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta, dataportfolio } from "../../content_option";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SquirrelHover } from "../../components/squirrel_hover";

const featuredProjects = dataportfolio.slice(0, 4);

export const Home = () => {
  const homeRef = useRef(null);
  const heroRef = useRef(null);
  const featuredRef = useRef(null);
  const featuredHeaderRef = useRef(null);
  const featuredListRef = useRef(null);

  useLayoutEffect(() => {
    if (
      !homeRef.current ||
      !heroRef.current ||
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

    const setProjectFocus = (isProjectFocused) => {
      document.body.classList.toggle("is-project-focus", isProjectFocused);
    };

    if (prefersReducedMotion) {
      setProjectFocus(false);
      return () => setProjectFocus(false);
    }

    const ctx = gsap.context(() => {
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
            scrub: 0.8,
            onUpdate: (self) => setProjectFocus(self.progress > 0.45),
            onLeaveBack: () => setProjectFocus(false),
          },
        })
        .fromTo(
          featuredRef.current,
          { y: 64, scale: 0.97, opacity: 0.82 },
          { y: 0, scale: 1, opacity: 1 },
          0
        )
        .to(heroRef.current, { y: -34, scale: 0.965, opacity: 0.56 }, 0)
        .fromTo(
          featuredHeaderRef.current,
          { y: 18, opacity: 0.82 },
          { y: 0, opacity: 1 },
          0.1
        )
        .fromTo(
          featuredListRef.current,
          { y: 26, opacity: 0.86 },
          { y: 0, opacity: 1 },
          0.14
        );
    }, homeRef);

    return () => {
      setProjectFocus(false);
      ctx.revert();
    };
  }, []);

  return (
    <HelmetProvider>
      <section id="home" className="home" ref={homeRef}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <div className="home_shell">
          <div className="home_hero home_hero_anim" ref={heroRef}>
            <p className="home_eyebrow">
              <span className="status_dot" aria-hidden="true"></span>
              <span className="status_text">
                <span className="status_old">Learning</span>{" "}
                <span className="status_new">Building</span>stuff in UMich
              </span>
            </p>
            <h1 className="home_title">
              AI-driven Product Manager who speaks engineering
            </h1>
            <p className="home_subtitle">
              I turn ambiguity into shipped products and business lift
            </p>

            <div className="hero_proof">
              <p className="hero_proof_item">$2M+ monthly revenue impact through shipped product systems</p>
              <p className="hero_proof_item">Led product execution across automotive, fintech, and classifieds</p>
              <p className="hero_proof_item">
                Admitted to the{" "}
                <SquirrelHover text="University of Michigan" /> School of
                Information
              </p>
            </div>
          </div>

          <section
            className="featured_projects featured_projects_anim"
            aria-label="Featured projects"
            ref={featuredRef}
          >
            <div className="featured_projects_header" ref={featuredHeaderRef}>
              <h2>Featured Projects</h2>
              <Link to="/portfolio" className="featured_projects_link">
                View all
              </Link>
            </div>

            <div className="featured_projects_list" ref={featuredListRef}>
              {featuredProjects.map((project) => (
                <Link
                  key={project.id}
                  to={`/project/${project.id}`}
                  className="featured_project_row"
                  aria-label={`Open ${project.title}`}
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
                      <span className="featured_project_badge">Featured</span>
                      {project.timeline && (
                        <>
                          <span className="featured_project_sep">•</span>
                          <span className="featured_project_timeline">
                            {project.timeline}
                          </span>
                        </>
                      )}
                      <span className="featured_project_sep">•</span>
                      <span className="featured_project_role">
                        {project.role || "Product Case Study"}
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
