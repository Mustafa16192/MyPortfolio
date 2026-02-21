import React from "react";
import "./style.css";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { TypewriterHeading } from "../../components/typewriter_heading";
import {
  dataabout,
  meta,
  worktimeline,
  skills,
  milestones,
} from "../../content_option";

export const Resume = () => {
  return (
    <HelmetProvider>
      <Container className="About-header page-nav-offset">
        <Helmet>
          <meta charSet="utf-8" />
          <title>Resume | {meta.title}</title>
          <meta name="description" content={meta.description} />
        </Helmet>

        <Row className="page-heading-row align-items-center justify-content-between">
          <Col lg="6" className="d-flex align-items-center">
            <TypewriterHeading text="Resume" className="display-4 mb-0 mr-4" />
          </Col>
          <Col lg="6" className="d-flex justify-content-lg-end mt-3 mt-lg-0">
            <a
              href="/Mustafa_Ali_Resume.pdf"
              download
              target="_blank"
              rel="noopener noreferrer"
              className="btn ac_btn resume_download_btn"
            >
              Download PDF
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
      </Container>
    </HelmetProvider>
  );
};
