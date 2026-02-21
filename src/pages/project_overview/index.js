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
import { motion } from "framer-motion";
import { TypewriterHeading } from "../../components/typewriter_heading";

const toSectionId = (title, index) => {
  const base = (title || `Section ${index + 1}`)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `chapter-${index + 1}-${base || "section"}`;
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
  const sectionRefs = useRef([]);
  const [activeChapter, setActiveChapter] = useState(0);
  const chapterItems = useMemo(() => {
    const sections = project?.sections || [];
    return sections.map((section, index) => {
      const hasTitle =
        typeof section.title === "string" && section.title.trim().length > 0;
      const title = hasTitle ? section.title.trim() : `Section ${index + 1}`;
      return {
        id: toSectionId(title, index),
        title,
      };
    });
  }, [project]);

  useLayoutEffect(() => {
    setActiveChapter(0);
    if (window.innerWidth < 992) {
      window.scrollTo(0, 0);
    }
  }, [id]);

  useEffect(() => {
    if (!chapterItems.length) {
      return undefined;
    }

    const visibleRatios = new Map();
    const sectionElements = chapterItems.map((_, index) => sectionRefs.current[index]);
    const desktopContainer =
      window.innerWidth >= 992 ? pageContainerRef.current : null;
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
  }, [chapterItems, id]);

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
            <Link to="/portfolio" className="btn ac_btn">
              Back to Portfolio
            </Link>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <HelmetProvider>
      <Container
        ref={pageContainerRef}
        className="About-header fixed-page project-overview-page"
        as={motion.div}
        exit={{ opacity: 0 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Helmet>
          <meta charSet="utf-8" />
          <title>{project.title || "Project"} | {meta.title}</title>
          <meta name="description" content={project.description} />
        </Helmet>

        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="12">
            <TypewriterHeading
              text={project.title || project.description}
              className="display-4 mb-0"
            />
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        <Row className="sec_sp mb-5">
          <Col lg="6" className="mb-4 mb-lg-0">
            {(project.role || project.timeline) && (
              <div className="d-flex flex-wrap mb-4" style={{ gap: "2rem" }}>
                {project.role && (
                  <div>
                    <h5 className="color_sec mb-1" style={{ fontSize: "1rem", opacity: 0.8 }}>
                      ROLE
                    </h5>
                    <p>{project.role}</p>
                  </div>
                )}
                {project.timeline && (
                  <div>
                    <h5 className="color_sec mb-1" style={{ fontSize: "1rem", opacity: 0.8 }}>
                      TIMELINE
                    </h5>
                    <p>{project.timeline}</p>
                  </div>
                )}
              </div>
            )}
            <h3 className="color_sec py-4">Overview</h3>
            <p>{project.details || project.description}</p>
            <div className="mt-4">
              <Link to="/portfolio" className="btn ac_btn">
                Back to Portfolio
              </Link>
            </div>
          </Col>
          <Col lg="6" className="d-flex align-items-center justify-content-center">
            <div className="project-image-container w-100">
              <motion.img
                layoutId={`project-image-${project.id}`}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                src={require(`../../assets/images/${project.img}`)}
                alt={project.title}
                className="img-fluid rounded shadow-sm"
              />
            </div>
          </Col>
        </Row>

        {project.sections && project.sections.length > 0 && (
          <Row className="project-chapter-layout justify-content-center">
            <Col lg="3" className="project-chapter-nav-col d-none d-lg-block">
              <nav className="project-chapter-nav" aria-label="Project chapters">
                <ul className="project-chapter-list">
                  {chapterItems.map((chapter, index) => (
                    <li key={chapter.id} className="project-chapter-list-item">
                      <button
                        type="button"
                        className={`project-chapter-link ${activeChapter === index ? "is-active" : ""}`}
                        onClick={(event) => handleChapterClick(event, chapter.id, index)}
                        aria-current={activeChapter === index ? "true" : undefined}
                      >
                        {chapter.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            </Col>

            <Col lg="8" className="project-chapter-content-col">
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
                      {chapter.title}
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
                  <h3 className="color_sec py-3 display-6">
                    {section.title && section.title.trim()
                      ? section.title
                      : chapterItems[index].title}
                  </h3>
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
                        alt={section.title || chapterItems[index].title}
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
