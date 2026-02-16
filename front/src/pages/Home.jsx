import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Home.css";

const Hero = () => {
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = useState(false);

  const handleNavigate = () => {
    setIsLeaving(true);

    setTimeout(() => {
      navigate("/auth");
    }, 500); // match animation duration
  };

  return (
    <div className={isLeaving ? "page-exit" : ""}>
      <section className="hero-section">
        <div className="hero-text container">
          <h5 className="hero-top-title text-uppercase fw-bold">
            Manage Smarter
          </h5>

          <h1 className="hero-title display-4 fw-bold">
            Hospital Equipment Maintenance
            <br />& Stock Management System
          </h1>

          <button className="cta-btn btn btn-lg" onClick={handleNavigate}>
            Get Started
          </button>
        </div>
      </section>
    </div>
  );
};

export default Hero;
