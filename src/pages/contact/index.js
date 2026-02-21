import React, { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta } from "../../content_option";
import { Container, Row, Col, Alert } from "react-bootstrap";
import emailjs from "emailjs-com";

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    message: "",
    loading: false,
    showAlert: false,
    successMessage: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, loading: true }));

    // Ensure the parameter keys below exactly match what you have in your EmailJS template.
    emailjs
      .send(
        "service_2df2vzf",       // Your EmailJS Service ID
        "template_wf5n7c9",       // Your EmailJS Template ID
        {
          name: formData.name,
          message: formData.message + "\n\nFrom Email: " + formData.email,
        },
        "N3dpK6g0mb2J6ajsg"        // Your EmailJS Public Key
      )
      .then(
        (response) => {
          setFormData({
            email: "",
            name: "",
            message: "",
            loading: false,
            showAlert: true,
            successMessage: "Message sent successfully!",
          });

          // Automatically hide the alert after 2 seconds.
          setTimeout(() => {
            setFormData((prev) => ({ ...prev, showAlert: false }));
          }, 2000);
        },
        (error) => {
          setFormData((prev) => ({
            ...prev,
            loading: false,
            showAlert: true,
            successMessage: "Failed to send message. Please try again.",
          }));

          // Automatically hide the alert after 2 seconds.
          setTimeout(() => {
            setFormData((prev) => ({ ...prev, showAlert: false }));
          }, 2000);
        }
      );
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <HelmetProvider>
      <Container className="About-header page-nav-offset">
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} | Contact</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="page-heading-row">
          <Col lg="8">
            <h1 className="display-4 mb-0">Contact Me</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        <Row className="sec_sp">
          <Col lg="12">
            {formData.showAlert && (
              <Alert
                variant={
                  formData.successMessage.includes("Failed")
                    ? "danger"
                    : "success"
                }
              >
                {formData.successMessage}
              </Alert>
            )}
          </Col>
          <Col lg="5" className="mb-5">
            <h3 className="color_sec py-4">Get in touch</h3>
            <address>
              <strong>Email:</strong>{" "}
              <a href="mailto:mustafa_mirza_56@outlook.com">
                mustafa_mirza_56@outlook.com
              </a>
              <br />
              <br />
            </address>
            <p>Or send a message using the form:</p>
          </Col>

          <Col lg="7" className="d-flex align-items-center">
            <form
              onSubmit={handleSubmit}
              className="contact__form w-100"
            >
              <Row>
                <Col lg="6" className="form-group">
                  <input
                    className="form-control rounded-0"
                    id="name"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </Col>
                <Col lg="6" className="form-group">
                  <input
                    className="form-control rounded-0"
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={formData.email}
                    required
                    onChange={handleChange}
                  />
                </Col>
              </Row>

              <textarea
                className="form-control rounded-0 mt-3"
                id="message"
                name="message"
                placeholder="Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
              ></textarea>

              <Row className="mt-3">
                <Col lg="12" className="form-group">
                  <button
                    className="btn ac_btn"
                    type="submit"
                    disabled={formData.loading}
                  >
                    {formData.loading ? "Sending..." : "Send"}
                  </button>
                </Col>
              </Row>
            </form>
          </Col>
        </Row>

        <div className={formData.loading ? "loading-bar" : "d-none"}></div>
      </Container>
    </HelmetProvider>
  );
};
