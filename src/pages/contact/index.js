import React, { useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { meta } from "../../content_option";
import { Container, Row, Col, Alert } from "react-bootstrap";

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
    setFormData({ ...formData, loading: true });

    // Simulate form submission process
    setTimeout(() => {
      setFormData({
        ...formData,
        loading: false,
        showAlert: true,
        successMessage: "Message sent successfully!",
      });
      // Hide the success message after 2 seconds
      setTimeout(() => {
        setFormData(formData => ({ ...formData, showAlert: false }));
      }, 2000);
    }, 2000); // Simulating a 2-second delay, replace with actual submission logic
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <HelmetProvider>
      <Container>
        <Helmet>
          <meta charSet="utf-8" />
          <title>{meta.title} | Contact</title>
          <meta name="description" content={meta.description} />
        </Helmet>
        <Row className="mb-5 mt-3 pt-md-3">
          <Col lg="8">
            <h1 className="display-4 mb-4">Contact Me</h1>
            <hr className="t_border my-4 ml-0 text-left" />
          </Col>
        </Row>
        <Row className="sec_sp">
          <Col lg="12">
            {formData.showAlert && (
              <Alert variant={formData.successMessage.includes("Failed") ? "danger" : "success"}>
                {formData.successMessage}
              </Alert>
            )}
          </Col>
          <Col lg="5" className="mb-5">
            <h3 className="color_sec py-4">Get in touch</h3>
            <address>
              <strong>Email:</strong> <a href="mailto:recipient@example.com">recipient@example.com</a><br /><br />
            </address>
            <p>Write your message in the form:</p>
          </Col>
          <Col lg="7" className="d-flex align-items-center">
            <form onSubmit={handleSubmit} className="contact__form w-100" style={{ backgroundColor: "black", border: "1px solid white", padding: "20px" }}>
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
                    style={{ backgroundColor: "black", color: "white" }}
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
                    style={{ backgroundColor: "black", color: "white" }}
                  />
                </Col>
              </Row>
              <textarea
                className="form-control rounded-0"
                id="message"
                name="message"
                placeholder="Message"
                rows="5"
                value={formData.message}
                onChange={handleChange}
                required
                style={{ backgroundColor: "black", color: "white", marginTop: "5px" }}
              ></textarea>
              <br />
              <Row>
                <Col lg="12" className="form-group">
                  <button className="btn ac_btn" type="submit" disabled={formData.loading}>
                    {formData.loading ? "Sending..." : "Send"}
                  </button>
                </Col>
              </Row>
            </form>
          </Col>
        </Row>
      </Container>
      <div className={formData.loading ? "loading-bar" : "d-none"}></div>
    </HelmetProvider>
  );
};
