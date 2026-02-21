import React, { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta } from "../../content_option";
import { Container, Row, Col } from "react-bootstrap";
import emailjs from "emailjs-com";
import { TypewriterHeading } from "../../components/typewriter_heading";

export const ContactUs = () => {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    message: "",
    loading: false,
    showAlert: false,
    successMessage: "",
    alertType: "",
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
        () => {
          setFormData({
            email: "",
            name: "",
            message: "",
            loading: false,
            showAlert: true,
            successMessage: "Message sent successfully!",
            alertType: "success",
          });

          // Automatically hide the alert after 2 seconds.
          setTimeout(() => {
            setFormData((prev) => ({ ...prev, showAlert: false }));
          }, 2000);
        },
        () => {
          setFormData((prev) => ({
            ...prev,
            loading: false,
            showAlert: true,
            successMessage: "Failed to send message. Please try again.",
            alertType: "error",
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
            <TypewriterHeading text="Contact Me" className="display-4 mb-0" />
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>

        <Row className="sec_sp">
          <Col lg="5" className="mb-5 contact_intro_col">
            <h3 className="color_sec py-4">Get in touch</h3>
            <address className="contact_info_block">
              <strong>Email:</strong>{" "}
              <a href="mailto:mustafa_mirza_56@outlook.com">
                mustafa_mirza_56@outlook.com
              </a>
              <br />
              <br />
            </address>
            <p className="contact_intro_text">Or send a message using the form:</p>
          </Col>

          <Col lg="7" className="d-flex align-items-start contact_form_col">
            <form
              onSubmit={handleSubmit}
              className="contact__form contact_form_shell w-100"
            >
              <div
                className={`contact_loading_line ${formData.loading ? "is-active" : ""}`}
                aria-hidden="true"
              ></div>

              {formData.showAlert && (
                <div
                  className={`contact_status contact_status--${formData.alertType}`}
                  role="status"
                  aria-live="polite"
                >
                  <span className="contact_status_dot" aria-hidden="true"></span>
                  <span>{formData.successMessage}</span>
                </div>
              )}

              <div className="contact_form_row">
                <div className="contact_field_group">
                  <label htmlFor="name" className="contact_field_label">
                    Name
                  </label>
                  <input
                    className="form-control contact_input"
                    id="name"
                    name="name"
                    placeholder="Your full name"
                    value={formData.name}
                    type="text"
                    required
                    onChange={handleChange}
                  />
                </div>
                <div className="contact_field_group">
                  <label htmlFor="email" className="contact_field_label">
                    Email
                  </label>
                  <input
                    className="form-control contact_input"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    type="email"
                    value={formData.email}
                    required
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="contact_field_group contact_field_group--message">
                <label htmlFor="message" className="contact_field_label">
                  Message
                </label>
                <textarea
                  className="form-control contact_input contact_textarea"
                  id="message"
                  name="message"
                  placeholder="Tell me a bit about your project, role, or what you'd like to collaborate on."
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="contact_submit_row">
                <button
                  className="btn ac_btn contact_submit_btn"
                  type="submit"
                  disabled={formData.loading}
                >
                  {formData.loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </Col>
        </Row>
      </Container>
    </HelmetProvider>
  );
};
