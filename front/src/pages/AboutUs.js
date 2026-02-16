import React, { useEffect } from "react";
import "../styles/About.css";

const About = () => {
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
      { threshold: 0.2 },
    );

    elements.forEach((el) => observer.observe(el));
  }, []);

  return (
    <div className="about-page">
      {/* HERO */}
      <section className="about-hero d-flex align-items-center text-white text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">About the System</h1>
          <p className="lead mt-3">
            Enhancing operational efficiency, preventive maintenance management,
            and intelligent inventory control within hospital environments.
          </p>
        </div>
      </section>

      {/* PROBLEM STATEMENT */}
      <section className="container py-5 fade-section">
        <h3 className="fw-bold mb-4 text-center">Problem Statement</h3>
        <p className="text-muted text-center px-md-5">
          Many healthcare institutions rely on manual tracking systems for
          equipment management, leading to inconsistent records, delayed
          maintenance, stock shortages, and operational inefficiencies. The
          absence of centralized monitoring reduces accountability and limits
          data-driven decision-making.
        </p>
      </section>

      {/* OBJECTIVES */}
      <section className="bg-light py-5 fade-section">
        <div className="container">
          <h3 className="fw-bold text-center mb-4">System Objectives</h3>
          <ul className="objectives-list">
            <li>Centralized equipment registration and lifecycle tracking</li>
            <li>Automated preventive maintenance scheduling</li>
            <li>Real-time stock monitoring and alerts</li>
            <li>Role-based secure access control</li>
            <li>Comprehensive reporting and analytics dashboard</li>
          </ul>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-5 fade-section">
        <h3 className="fw-bold text-center mb-5">Key Features</h3>

        <div className="row g-4">
          <div className="col-md-6 col-lg-4">
            <div className="feature-card">
              <h5>Role-Based Authentication</h5>
              <p>
                Secure login access tailored to administrative, maintenance, and
                inventory roles.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="feature-card">
              <h5>Maintenance Tracking</h5>
              <p>
                Preventive and corrective maintenance management with automated
                reminders.
              </p>
            </div>
          </div>

          <div className="col-md-6 col-lg-4">
            <div className="feature-card">
              <h5>Inventory Monitoring</h5>
              <p>
                Continuous stock level tracking to prevent shortages and
                overstocking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="bg-light py-5 fade-section">
        <div className="container text-center">
          <h3 className="fw-bold mb-4">Technology Stack</h3>
          <p className="text-muted">
            React (Frontend), Bootstrap (UI Framework), Node.js & Express
            (Backend), MongoDB (Database), Chart.js (Data Visualization).
          </p>
        </div>
      </section>

      {/* SYSTEM ARCHITECTURE BLOCK */}
      <section className="system-architecture py-5 fade-section">
        <div className="container text-center">
          <h3 className="fw-bold mb-4">System Architecture</h3>

          <div className="architecture-block mx-auto">
            <div className="arch-box fade-section animate-delay-1">
              React Frontend
            </div>
            <div className="arch-arrow fade-section animate-delay-2">↓</div>

            <div className="arch-box fade-section animate-delay-3">
              Express API Layer
            </div>
            <div className="arch-arrow  fade-section animate-delay-4">↓</div>

            <div className="arch-box fade-section animate-delay-5">
              MongoDB Database
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT */}
      <section className="container py-5 fade-section">
        <h3 className="fw-bold text-center mb-4">Expected Impact</h3>
        <p className="text-muted text-center px-md-5">
          The implementation of this system is expected to reduce equipment
          downtime, improve maintenance accountability, enhance inventory
          accuracy, and enable strategic decision-making through real-time
          analytics.
        </p>
      </section>
    </div>
  );
};

export default About;
