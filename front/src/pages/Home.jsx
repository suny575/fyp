import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Home.css";
const Hero = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="hero-section ">
        <div className="hero-text container">
          <h5 className="hero-top-title text-uppercase fw-bold">
            Manage Smarter
          </h5>
          <h1 className="hero-title display-4 fw-bold">
            Hospital Equipment Maintenance
            <br />
             & Stock Management System
          </h1>
          {/* CTA Button */}
          <button className="cta-btn btn btn-lg">
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
};

export default Hero;
