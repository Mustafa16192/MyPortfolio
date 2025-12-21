import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TypewriterHeading } from "../../components/typewriter_heading";
import {
  dataabout,
  meta,
  worktimeline,
  skills,
  milestones,
  dataportfolio,
} from "../../content_option";

export const Portfolio = () => {
  return (
    <HelmetProvider>
      <Container className="About-header absolute-page" as={motion.div} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Portfolio | {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <Row className="mb-5 mt-3 pt-md-3 align-items-center justify-content-between">
          <Col lg="8" className="d-flex align-items-center">
            <TypewriterHeading text="Featured Projects" className="display-4 mb-0 mr-4" />
          </Col>
          <Col lg="12">
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        {/* PORTFOLIO SECTION */}
        <Row className="sec_sp">
            <Row>
              {dataportfolio.map((project, i) => (
                <Col md={6} className="mb-4" key={i}>
                  <div className="portfolio-item">
                    <div className="portfolio-thumb mb-2">
                       {project.id ? (
                        <Link to={`/project/${project.id}`}>
                          <motion.img
                            layoutId={`project-image-${project.id}`}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            src={require(`../../assets/images/${project.img}`)}
                            alt={`Project ${i + 1}`}
                            className="img-fluid rounded shadow-sm"
                          />
                        </Link>
                      ) : (
                        <img
                          src={require(`../../assets/images/${project.img}`)}
                          alt={`Project ${i + 1}`}
                          className="img-fluid rounded shadow-sm"
                        />
                      )}
                    </div>
                    <p className="service_desc">{project.description}</p>
                    
                    {project.link && project.link !== "#" && (
                      <a
                        href={project.link}
                        className="btn btn-outline-secondary btn-sm mt-2"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Link
                      </a>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
        </Row>
      </Container>
    </HelmetProvider>
  );
};