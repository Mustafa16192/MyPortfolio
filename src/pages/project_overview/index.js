import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { dataportfolio, meta } from "../../content_option";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ProjectTradeoffs } from "../../components/project_tradeoffs";

const NAV_LABEL_ALIASES = [
  { match: /^problem/i, label: "Problem Statement" },
  { match: /^research/i, label: "User Research" },
  { match: /^insights?/i, label: "Insights & Approach" },
  { match: /^ideation/i, label: "Ideation & Sketching" },
  { match: /^solution/i, label: "Solution & Prototype" },
  { match: /^outcomes?/i, label: "Outcomes & Learnings" },
];

const toSectionId = (title, index) => {
  const base = (title || `Key Section ${index + 1}`)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `chapter-${index + 1}-${base || "section"}`;
};

const normalizeTitle = (value = "") =>
  value
    .replace(/^\s*\d+\s*[\.\)]\s*/, "")
    .replace(/\s+/g, " ")
    .trim();

const inferSectionTitle = (section, index) => {
  if (!section) {
    return `Key Section ${index + 1}`;
  }
  if (section.type === "video") {
    return "Prototype Walkthrough";
  }
  const textBlob = `${section.content || ""} ${section.caption || ""}`.toLowerCase();
  const imagePath = (section.img || "").toLowerCase();
  if (textBlob.includes("smart reminder") || textBlob.includes("settings")) {
    return "Smart Reminder Controls";
  }
  if (textBlob.includes("quick query") || textBlob.includes("suggestion")) {
    return "Quick Query Exploration";
  }
  if (imagePath.includes("sketch2")) {
    return "Smart Reminder Controls";
  }
  if (imagePath.includes("sketch3")) {
    return "Quick Query Exploration";
  }
  if (section.caption) {
    return normalizeTitle(section.caption).split(":")[0].trim() || `Key Section ${index + 1}`;
  }
  return `Key Section ${index + 1}`;
};

const toNavLabel = (heading, section, index) => {
  let label = normalizeTitle(heading);
  const alias = NAV_LABEL_ALIASES.find((item) => item.match.test(label));
  if (alias) {
    label = alias.label;
  } else if (label.includes(":")) {
    const [prefix, suffix] = label.split(":");
    const concisePrefix = normalizeTitle(prefix);
    const conciseSuffix = normalizeTitle(suffix || "");
    if (concisePrefix.length <= 20) {
      label = concisePrefix;
    } else if (conciseSuffix.length > 0 && conciseSuffix.length <= 40) {
      label = conciseSuffix;
    }
  }

  if (!label) {
    label = inferSectionTitle(section, index);
  }

  if (label.length > 40) {
    label = `${label.slice(0, 37).trimEnd()}...`;
  }
  return label;
};

const VideoSection = ({ src, caption }) => {
  const videoRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current.play().catch((error) => {
            console.log("Autoplay prevented:", error);
          });
        } else {
          videoRef.current.pause();
        }
      },
      { threshold: 0.4 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  return (
    <div className="mt-4 mb-4">
      <video
        ref={videoRef}
        width="100%"
        className="rounded shadow-sm"
        muted
        loop
        playsInline
        controls
      >
        <source src={require(`../../assets/${src}`)} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {caption && (
        <p className="text-center mt-2" style={{ opacity: 0.9, fontStyle: "italic" }}>
          {caption}
        </p>
      )}
    </div>
  );
};

export const ProjectOverview = () => {
  const { id } = useParams();
  const project = dataportfolio.find((p) => p.id === id);
  const pageContainerRef = useRef(null);
  const projectIntroRowRef = useRef(null);
  const projectImageContainerRef = useRef(null);
  const sectionRefs = useRef([]);
  const [activeChapter, setActiveChapter] = useState(0);
  const [isDesktopViewport, setIsDesktopViewport] = useState(
    () => window.innerWidth >= 992
  );
  const chapterItems = useMemo(() => {
    const sections = project?.sections || [];
    const customLabels = project?.chapterLabels || [];
    return sections.map((section, index) => {
      const customLabel =
        typeof customLabels[index] === "string" ? customLabels[index].trim() : "";
      const hasTitle = typeof section.title === "string" && section.title.trim().length > 0;
      const heading = hasTitle ? normalizeTitle(section.title) : inferSectionTitle(section, index);
      const navLabel = customLabel || toNavLabel(heading, section, index);
      return {
        id: toSectionId(heading, index),
        heading,
        navLabel,
      };
    });
  }, [project]);

  useLayoutEffect(() => {
    setActiveChapter(0);
    if (window.innerWidth < 992) {
      window.scrollTo(0, 0);
    }
  }, [id]);

  useLayoutEffect(() => {
    if (!projectIntroRowRef.current || !projectImageContainerRef.current) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const introRowEl = projectIntroRowRef.current;
    const imageContainerEl = projectImageContainerRef.current;

    gsap.killTweensOf([introRowEl, imageContainerEl]);

    if (prefersReducedMotion) {
      gsap.set([introRowEl, imageContainerEl], {
        clearProps: "opacity,visibility,transform",
      });
      return undefined;
    }

    const ctx = gsap.context(() => {
      gsap.set(introRowEl, {
        autoAlpha: 0,
        y: 8,
        force3D: true,
      });
      gsap.set(imageContainerEl, {
        autoAlpha: 0,
        y: 12,
        scale: 0.996,
        force3D: true,
        transformOrigin: "50% 50%",
      });

      gsap
        .timeline({
          defaults: {
            ease: "power2.out",
            overwrite: "auto",
          },
        })
        .to(
          introRowEl,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.24,
            clearProps: "opacity,visibility,transform",
          },
          0
        )
        .to(
          imageContainerEl,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.32,
            clearProps: "opacity,visibility,transform",
          },
          0.05
        );
    }, pageContainerRef);

    return () => {
      ctx.revert();
      gsap.killTweensOf([introRowEl, imageContainerEl]);
    };
  }, [id]);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopViewport(window.innerWidth >= 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!chapterItems.length) {
      return undefined;
    }

    const visibleRatios = new Map();
    const sectionElements = chapterItems.map((_, index) => sectionRefs.current[index]);
    const desktopContainer = isDesktopViewport ? pageContainerRef.current : null;
    const isContainerScroll = Boolean(desktopContainer);
    const scrollRoot = isContainerScroll ? desktopContainer : null;
    let rafId = 0;

    const updateActiveFromVisibility = () => {
      const centerLine = isContainerScroll
        ? desktopContainer.getBoundingClientRect().top +
          desktopContainer.getBoundingClientRect().height * 0.48
        : window.innerHeight * 0.48;
      let bestIndex = -1;
      let bestScore = -1;

      sectionElements.forEach((sectionEl, index) => {
        if (!sectionEl) {
          return;
        }
        const ratio = visibleRatios.get(index) || 0;
        if (ratio <= 0) {
          return;
        }
        const rect = sectionEl.getBoundingClientRect();
        const distancePenalty = Math.abs(rect.top - centerLine) * 0.0009;
        const score = ratio - distancePenalty;
        if (score > bestScore) {
          bestScore = score;
          bestIndex = index;
        }
      });

      if (bestIndex === -1) {
        let fallbackIndex = 0;
        let minDistance = Number.POSITIVE_INFINITY;
        sectionElements.forEach((sectionEl, index) => {
          if (!sectionEl) {
            return;
          }
          const distance = Math.abs(sectionEl.getBoundingClientRect().top - centerLine);
          if (distance < minDistance) {
            minDistance = distance;
            fallbackIndex = index;
          }
        });
        bestIndex = fallbackIndex;
      }

      setActiveChapter((prev) => (prev === bestIndex ? prev : bestIndex));
    };

    const scheduleUpdate = () => {
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      rafId = requestAnimationFrame(updateActiveFromVisibility);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const sectionIndex = Number(entry.target.getAttribute("data-chapter-index"));
          if (Number.isNaN(sectionIndex)) {
            return;
          }
          visibleRatios.set(sectionIndex, entry.isIntersecting ? entry.intersectionRatio : 0);
        });
        scheduleUpdate();
      },
      {
        root: scrollRoot,
        rootMargin: "-40% 0px -45% 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    sectionElements.forEach((sectionEl, index) => {
      if (!sectionEl) {
        return;
      }
      visibleRatios.set(index, 0);
      observer.observe(sectionEl);
    });

    const handleScrollEnd = () => {
      const atBottom = isContainerScroll
        ? desktopContainer.scrollTop + desktopContainer.clientHeight >=
          desktopContainer.scrollHeight - 80
        : window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 80;
      if (atBottom) {
        setActiveChapter(chapterItems.length - 1);
      }
      scheduleUpdate();
    };

    const scrollTarget = isContainerScroll ? desktopContainer : window;
    scrollTarget.addEventListener("scroll", handleScrollEnd, { passive: true });
    scheduleUpdate();

    return () => {
      scrollTarget.removeEventListener("scroll", handleScrollEnd);
      observer.disconnect();
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [chapterItems, id, isDesktopViewport]);

  useLayoutEffect(() => {
    if (!chapterItems.length) {
      return undefined;
    }

    const sections = chapterItems
      .map((_, index) => sectionRefs.current[index])
      .filter(Boolean);
    if (!sections.length) {
      return undefined;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const clearSectionFocus = () => {
      sections.forEach((section) => {
        section.classList.remove("is-focused");
        section.style.removeProperty("opacity");
        section.style.removeProperty("transform");
      });
    };

    if (prefersReducedMotion || !isDesktopViewport) {
      clearSectionFocus();
      return undefined;
    }

    gsap.registerPlugin(ScrollTrigger);
    const scrollerEl = pageContainerRef.current || undefined;

    const ctx = gsap.context(() => {
      const setFocusedSection = (focusIndex) => {
        sections.forEach((section, index) => {
          const isFocused = index === focusIndex;
          section.classList.toggle("is-focused", isFocused);
          gsap.to(section, {
            opacity: isFocused ? 1 : 0.78,
            y: isFocused ? 0 : 7,
            scale: isFocused ? 1 : 0.992,
            duration: 0.32,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      };

      gsap.set(sections, {
        opacity: 0.86,
        y: 8,
        scale: 0.994,
        transformOrigin: "50% 0%",
      });
      setFocusedSection(0);

      sections.forEach((section, index) => {
        ScrollTrigger.create({
          trigger: section,
          scroller: scrollerEl,
          start: "top 64%",
          end: "bottom 40%",
          onEnter: () => setFocusedSection(index),
          onEnterBack: () => setFocusedSection(index),
        });
      });
    }, pageContainerRef);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
      clearSectionFocus();
    };
  }, [chapterItems, id, isDesktopViewport]);

  const handleChapterClick = useCallback((event, chapterId, index) => {
    event.preventDefault();
    setActiveChapter(index);
    const target = document.getElementById(chapterId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  if (!project) {
    return (
      <Container className="About-header">
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">Project Not Found</h1>
            <Link to="/#projects" className="btn ac_btn">
              Back to Projects
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <HelmetProvider>
      <Container
        fluid
        ref={pageContainerRef}
        className="About-header fixed-page project-overview-page"
      >
        <Helmet>
          <meta charSet="utf-8" />
          <title>{project.title || "Project"} | {meta.title}</title>
          <meta name="description" content={project.description} />
        </Helmet>

        <Row className="mb-5 mt-3 pt-md-3" ref={projectIntroRowRef}>
          <Col lg="12">
            <h1 className="display-4 mb-0">
              {project.title || project.description}
            </h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        <Row className="project-summary-row">
          <Col lg="4" className="project-summary-text-col mb-4 mb-lg-0">
            {(project.role || project.timeline) && (
              <div className="project-summary-meta">
                {project.role && (
                  <div className="project-summary-meta-item">
                    <h5 className="color_sec mb-1">
                      ROLE
                    </h5>
                    <p>{project.role}</p>
                  </div>
                )}
                {project.timeline && (
                  <div className="project-summary-meta-item">
                    <h5 className="color_sec mb-1">
                      TIMELINE
                    </h5>
                    <p>{project.timeline}</p>
                  </div>
                )}
              </div>
            )}
            <h3 className="color_sec py-4">Overview</h3>
            <p className="project-overview-copy">{project.details || project.description}</p>
          </Col>
          <Col lg="8" className="project-summary-media-col d-flex align-items-center justify-content-center">
            <div
              className="project-image-container w-100"
              ref={projectImageContainerRef}
            >
              <img
                src={require(`../../assets/images/${project.img}`)}
                alt={project.title}
                className="img-fluid rounded shadow-sm"
              />
            </div>
          </Col>
        </Row>

        <ProjectTradeoffs projectId={project.id} items={project.tradeoffs || []} />

        {project.sections && project.sections.length > 0 && (
          <Row className="project-chapter-layout">
            <Col lg="3" xl="3" xxl="3" className="project-chapter-nav-col d-none d-lg-block">
              <nav className="project-chapter-nav" aria-label="Project chapters">
                <ul className="project-chapter-list">
                  {chapterItems.map((chapter, index) => (
                    <li key={chapter.id} className="project-chapter-list-item">
                      <button
                        type="button"
                        className={`project-chapter-link ${activeChapter === index ? "is-active" : ""}`}
                        onClick={(event) => handleChapterClick(event, chapter.id, index)}
                        aria-current={activeChapter === index ? "true" : undefined}
                        title={chapter.heading}
                      >
                        {chapter.navLabel}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </Col>

            <Col lg="9" xl="9" xxl="9" className="project-chapter-content-col">
              <nav className="project-chapter-mobile" aria-label="Project chapters">
                <div className="project-chapter-chip-track">
                  {chapterItems.map((chapter, index) => (
                    <button
                      key={chapter.id}
                      type="button"
                      className={`project-chapter-chip ${activeChapter === index ? "is-active" : ""}`}
                      onClick={(event) => handleChapterClick(event, chapter.id, index)}
                      aria-current={activeChapter === index ? "true" : undefined}
                    >
                      {chapter.navLabel}
                    </button>
                  ))}
                </div>
              </nav>

              {project.sections.map((section, index) => (
                <article
                  key={`${chapterItems[index].id}-${index}`}
                  id={chapterItems[index].id}
                  data-chapter-index={index}
                  ref={(node) => {
                    sectionRefs.current[index] = node;
                  }}
                  className="project-case-section"
                >
                  <h3 className="color_sec py-3 display-6">{chapterItems[index].heading}</h3>
                  <div className="section-content">
                    {section.type === "video" ? (
                      <VideoSection src={section.src} caption={section.caption} />
                    ) : Array.isArray(section.content) ? (
                      section.content.map((paragraph, pIndex) => (
                        <p
                          key={pIndex}
                          className="mb-3"
                          style={{ fontSize: "1.1rem", lineHeight: "1.8" }}
                        >
                          {paragraph}
                        </p>
                      ))
                    ) : (
                      <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>{section.content}</p>
                    )}
                  </div>

                  {section.img && (
                    <div className="mt-4 mb-4">
                      <img
                        src={require(`../../assets/${section.img.includes("/") ? section.img : `images/${section.img}`}`)}
                        alt={section.title || chapterItems[index].heading}
                        className="img-fluid rounded shadow-sm"
                        style={{
                          width: "auto",
                          maxWidth: "100%",
                          maxHeight: "80vh",
                          display: "block",
                          margin: "0 auto",
                        }}
                      />
                      {section.caption && (
                        <p className="text-center mt-2" style={{ opacity: 0.9, fontStyle: "italic" }}>
                          {section.caption}
                        </p>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </Col>
          </Row>
        )}

        {project.sources && project.sources.length > 0 && (
          <Row className="justify-content-center mt-5">
            <Col lg="10">
              <h3 className="color_sec py-3 display-6">Sources & References</h3>
              <ul className="list-unstyled">
                {project.sources.map((source, index) => (
                  <li key={index} className="mb-2">
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--text-color)", textDecoration: "underline" }}
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </Col>
          </Row>
        )}
      </Container>
    </HelmetProvider>
  );
};
