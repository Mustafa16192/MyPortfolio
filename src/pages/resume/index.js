import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import {
  dataabout,
  meta,
  worktimeline,
  skills,
  milestones,
  dataportfolio,
} from "../../content_option";

export const Resume = () => {
  return (
    <HelmetProvider>
      <Container className="About-header">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Resume | {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <Row className="mb-5 mt-3 pt-md-3 align-items-center justify-content-between">
  <Col lg="6" className="d-flex align-items-center">
    <h1 className="display-4 mb-0 mr-4">Resume</h1>
  </Col>
  <Col lg="6" className="d-flex justify-content-lg-end mt-3 mt-lg-0">
    <a href="/Mustafa_Ali_Resume.pdf" download target="_blank" rel="noopener noreferrer">
      <div id="button_h" className="ac_btn btn">
        Download PDF
        <div className="ring one"></div>
        <div className="ring two"></div>
        <div className="ring three"></div>
      </div>
    </a>
  </Col>
  <Col lg="12">
    <hr className="t_border my-4 ml-0 text-left" />
  </Col>
</Row>

        {/* ABOUT ME SECTION */}
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">{dataabout.title}</h3>
          </Col>
          <Col lg="7">
            <p>{dataabout.aboutme}</p>
          </Col>
        </Row>

        {/* WORK TIMELINE SECTION */}
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Work Timeline</h3>
          </Col>
          <Col lg="7">
            <table className="table caption-top">
              <tbody>
                {worktimeline.map((data, i) => (
                  <tr key={i}>
                    <th scope="row">{data.jobtitle}</th>
                    <td>{data.where}</td>
                    <td>{data.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Col>
        </Row>

        {/* SKILLS SECTION */}
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Skills</h3>
          </Col>
          <Col lg="7">
            {skills.map((data, i) => (
              <div key={i}>
                <h3 className="progress-title">{data.name}</h3>
                <div className="progress">
                  <div
                    className="progress-bar"
                    style={{ width: `${data.value}%` }}
                  >
                    <div className="progress-value">{data.value}%</div>
                  </div>
                </div>
              </div>
            ))}
          </Col>
        </Row>

        {/* MILESTONES SECTION */}
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Milestones</h3>
          </Col>
          <Col lg="7">
            {milestones.map((data, i) => (
              <div className="service_ py-4" key={i}>
                <h5 className="service__title">{data.title}</h5>
                <p className="service_desc">{data.description}</p>
              </div>
            ))}
          </Col>
        </Row>

        {/* PORTFOLIO SECTION */}
        <Row className="sec_sp">
          <Col lg="5">
            <h3 className="color_sec py-4">Featured Projects</h3>
          </Col>
          <Col lg="7">
            <Row>
              {dataportfolio.map((project, i) => (
                <Col md={6} className="mb-4" key={i}>
                  <div className="portfolio-item">
                    <div className="portfolio-thumb mb-2">
                      <img
                        src={project.img}
                        alt={`Project ${i + 1}`}
                        className="img-fluid rounded shadow-sm"
                      />
                    </div>
                    <p className="service_desc">{project.description}</p>
                    {project.link && project.link !== "#" && (
                      <a
                        href={project.link}
                        className="btn btn-outline-primary btn-sm mt-2"
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Container>
    </HelmetProvider>
  );
};
