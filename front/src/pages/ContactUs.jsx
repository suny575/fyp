import React, { useEffect, useState } from "react";
import {
  FaClock,
  FaEnvelope,
  FaHeadset,
  FaMapMarkerAlt,
  FaPaperPlane,
  FaPhoneAlt,
} from "react-icons/fa";
import "../styles/Contact.css";
import { submitContactInquiry } from "../services/api";

const contactCards = [
  {
    icon: FaPhoneAlt,
    title: "Support desk",
    detail: "+250 700 000 000",
    caption: "For equipment support coordination and urgent follow-up.",
  },
  {
    icon: FaEnvelope,
    title: "Email channel",
    detail: "support@hemsms.com",
    caption: "For vendor communication, quotations, and service requests.",
  },
  {
    icon: FaMapMarkerAlt,
    title: "Operations office",
    detail: "Biomedical Services Wing",
    caption: "Aligned with hospital engineering and inventory operations.",
  },
];

const responseStandards = [
  "Priority incidents triaged for immediate review.",
  "Maintenance planning requests acknowledged during business hours.",
  "Partnership and onboarding inquiries routed to the implementation team.",
];

const initialForm = {
  name: "",
  email: "",
  organization: "",
  requestType: "Maintenance Coordination",
  message: "",
};

const Contact = () => {
  const [formData, setFormData] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const elements = document.querySelectorAll(".fade-section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.15 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (submitted) {
      setSubmitted(false);
    }
    if (feedbackMessage) {
      setFeedbackMessage("");
    }
    if (errorMessage) {
      setErrorMessage("");
    }
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const sendInquiry = async () => {
      try {
        setIsSubmitting(true);
        setErrorMessage("");
        const response = await submitContactInquiry(formData);
        setSubmitted(true);
        setFeedbackMessage(response.data.message);
        setFormData(initialForm);
      } catch (error) {
        setSubmitted(false);
        setFeedbackMessage("");
        setErrorMessage(
          error.response?.data?.message ||
            "Unable to send your inquiry right now. Please try again later.",
        );
      } finally {
        setIsSubmitting(false);
      }
    };

    sendInquiry();
  };

  return (
    <div className="contact-page">
      <section className="contact-shell">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-intro fade-section">
              <span className="contact-eyebrow">Contact the hospital operations team</span>
              <h1>Professional support for equipment, stock, and system coordination.</h1>
              <p>
                Use this page to route questions about maintenance workflows,
                asset visibility, implementation planning, or general support.
                The layout is designed to feel like a real hospital equipment
                service desk rather than a basic contact form.
              </p>

              <div className="contact-card-grid">
                {contactCards.map(({ icon: Icon, title, detail, caption }) => (
                  <article className="contact-info-card" key={title}>
                    <div className="contact-info-icon">
                      <Icon />
                    </div>
                    <h2>{title}</h2>
                    <strong>{detail}</strong>
                    <p>{caption}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="contact-form-panel fade-section">
              <div className="contact-form-header">
                <div className="contact-form-badge">
                  <FaHeadset />
                  <span>Service desk intake</span>
                </div>
                <p>
                  Share the type of support you need and the team can route the
                  request to the right operations owner.
                </p>
              </div>

              {submitted ? (
                <div className="contact-success-banner">
                  <FaPaperPlane />
                  <span>
                    {feedbackMessage}
                  </span>
                </div>
              ) : null}

              {errorMessage ? (
                <div className="contact-error-banner">
                  <span>{errorMessage}</span>
                </div>
              ) : null}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="contact-form-row">
                  <label htmlFor="name">Full name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="contact-form-row">
                  <label htmlFor="email">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <div className="contact-form-row">
                  <label htmlFor="organization">Hospital or organization</label>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    value={formData.organization}
                    onChange={handleChange}
                    placeholder="Enter hospital or department name"
                  />
                </div>

                <div className="contact-form-row">
                  <label htmlFor="requestType">Request type</label>
                  <select
                    id="requestType"
                    name="requestType"
                    value={formData.requestType}
                    onChange={handleChange}
                  >
                    <option>Maintenance Coordination</option>
                    <option>Inventory and Stock Visibility</option>
                    <option>System Onboarding</option>
                    <option>General Inquiry</option>
                  </select>
                </div>

                <div className="contact-form-row">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe the support you need"
                    required
                  />
                </div>

                <button
                  className="contact-submit-button"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending inquiry..." : "Send inquiry"}
                </button>
              </form>
            </div>
          </div>

          <div className="contact-support-strip fade-section">
            <article className="contact-support-card">
              <FaClock />
              <div>
                <h2>Response standards</h2>
                <ul>
                  {responseStandards.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </article>

            <article className="contact-support-card">
              <FaMapMarkerAlt />
              <div>
                <h2>Visit hours</h2>
                <p>Monday to Friday, 8:00 AM to 5:00 PM</p>
                <span>Scheduled demonstrations and operational reviews available on request.</span>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
