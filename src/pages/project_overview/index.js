import React, { useRef, useEffect } from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { useParams, Link } from "react-router-dom";
import { dataportfolio, meta } from "../../content_option";
import { motion } from "framer-motion";
import { TypewriterHeading } from "../../components/typewriter_heading";

const VideoSection = ({ src, caption }) => {
  const videoRef = useRef(null);
// ... existing VideoSection code ...
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current.play().catch((error) => {
            // Autoplay was prevented
            console.log("Autoplay prevented:", error);
          });
        } else {
          videoRef.current.pause();
        }
      },
      { threshold: 0.4 } // Play when 40% visible
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
    </div>
  );
};

export const ProjectOverview = () => {
  const { id } = useParams();
  const project = dataportfolio.find((p) => p.id === id);

  // Scroll to top on mount for mobile devices
  React.useLayoutEffect(() => {
    if (window.innerWidth < 992) {
      window.scrollTo(0, 0);
    }
  }, []);

  if (!project) {
// ... existing error handling ...
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
      <Container className="About-header fixed-page" as={motion.div} exit={{ opacity: 0 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{project.title || "Project"} | {meta.title}</title>
          <meta name="description" content={project.description} />
        </Helmet>
        
        {/* ... HERO SECTION & META DATA (No Changes) ... */}
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="12">
             <TypewriterHeading text={project.title || project.description} className="display-4 mb-0" />
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        <Row className="sec_sp mb-5">
          <Col lg="6" className="mb-4 mb-lg-0">
             {(project.role || project.timeline) && (
              <div className="d-flex flex-wrap mb-4" style={{ gap: "2rem" }}>
                {project.role && (
                  <div>
                    <h5 className="color_sec mb-1" style={{ fontSize: "1rem", opacity: 0.8 }}>ROLE</h5>
                    <p>{project.role}</p>
                  </div>
                )}
                {project.timeline && (
                  <div>
                     <h5 className="color_sec mb-1" style={{ fontSize: "1rem", opacity: 0.8 }}>TIMELINE</h5>
                    <p>{project.timeline}</p>
                  </div>
                )}
              </div>
            )}
            <h3 className="color_sec py-4">Overview</h3>
            <p>{project.details || project.description}</p>
             {project.link && project.link !== "#" && (
                <div className="mt-4">
                     <a href={project.link} target="_blank" rel="noreferrer" className="btn ac_btn">
                        View Live
                     </a>
                </div>
            )}
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
        
        {/* CASE STUDY SECTIONS */}
        {project.sections && (
            <Row className="justify-content-center">
                <Col lg="10">
                    {project.sections.map((section, index) => (
                        <div key={index} className="mb-3 pb-3">
                            <h3 className="color_sec py-3 display-6">{section.title}</h3>
                            <div className="section-content">
                                {section.type === "video" ? (
                                    <VideoSection src={section.src} caption={section.caption} />
                                ) : (
                                    Array.isArray(section.content) ? (
                                    section.content.map((paragraph, pIndex) => (
                                      <p key={pIndex} className="mb-3" style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>{paragraph}</p>
                                    ))
                                    ) : (
                                    <p style={{ fontSize: "1.1rem", lineHeight: "1.8" }}>{section.content}</p>
                                    )
                                )}
                            </div>
                            {/* Section Image */}
                            {section.img && (
                                <div className="mt-4 mb-4">
                                     <img
                                        src={require(`../../assets/${section.img.includes('/') ? section.img : `images/${section.img}`}`)}
                                        alt={section.title}
                                        className="img-fluid rounded shadow-sm"
                                        style={{ width: "auto", maxWidth: "100%", maxHeight: "80vh", display: "block", margin: "0 auto" }}
                                    />
                                    {section.caption && <p className="text-center text-muted mt-2">{section.caption}</p>}
                                </div>
                            )}
                        </div>
                    ))}
                </Col>
            </Row>
        )}

        {/* Project Sources */}
        {project.sources && project.sources.length > 0 && (
            <Row className="justify-content-center mt-5">
                <Col lg="10">
                    <h3 className="color_sec py-3 display-6">Sources & References</h3>
                    <ul className="list-unstyled">
                        {project.sources.map((source, index) => (
                            <li key={index} className="mb-2">
                                <a href={source.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-color)", textDecoration: "underline" }}>
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
