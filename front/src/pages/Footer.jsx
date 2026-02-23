// import React from "react";
import React from "react";
import "../styles/Footer.css";

const Footer = () => {
  return (
    <div>
      <footer className="overview-footer mt-5 py-3 border-top">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center">
          <div className="mb-2 mb-md-0">
            <span className="text-muted">&copy; 2026 MyCompany Inc.</span>
          </div>
          <div>
            <a href="#!" className="text-decoration-none text-muted me-3">
              Privacy Policy
            </a>
            <a href="#!" className="text-decoration-none text-muted me-3">
              Terms of Service
            </a>
            <a href="#!" className="text-decoration-none text-muted">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
