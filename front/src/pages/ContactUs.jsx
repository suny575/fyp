import React from "react";
import "../styles/Contact.css";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="contact-page d-flex justify-content-center align-items-center">
      {/* CENTERED FORM + ICONS */}
      <div className="contact-container text-center">
        {/* TOP ICONS */}
        <div className="contact-icons mb-4">
          <div className="icon-circle">
            <FaMapMarkerAlt size={24} />
          </div>
          <div className="icon-circle">
            <FaPhone size={24} />
          </div>
          <div className="icon-circle">
            <FaEnvelope size={24} />
          </div>
        </div>

        {/* FORM CARD */}
        <div className="contact-card p-4 shadow">
          <h3 className="mb-4 fw-bold">Get in Touch</h3>
          <form>
            <div className="form-group mb-3 input-icon">
              <FaUser className="input-fa" />
              <input
                type="text"
                className="form-control"
                placeholder="Your Name"
              />
            </div>
            <div className="form-group mb-3 input-icon">
              <FaEnvelope className="input-fa" />
              <input
                type="email"
                className="form-control"
                placeholder="Your Email"
              />
            </div>
            <div className="form-group mb-3 input-icon">
              <input
                type="text"
                className="form-control"
                placeholder="Subject"
              />
            </div>
            <div className="form-group mb-4 input-icon">
              <textarea
                className="form-control"
                rows="4"
                placeholder="Your Message"
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
