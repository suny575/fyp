import React, { useEffect } from "react";
import "../styles/HowItWorks.css";

const HowItWorks = () => {
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
    <div className="workflow-page">
      {/* HERO SECTION */}
      <section className="hero-section2 text-center text-white d-flex align-items-center">
        <div className="container">
          <h1 className="display-4 fw-bold">System Workflow</h1>
          <p className="lead mt-3">
            A structured and automated operational process designed to ensure
            efficient hospital equipment lifecycle management, preventive
            maintenance scheduling, and intelligent stock monitoring.
          </p>
        </div>
      </section>

      {/* DESCRIPTION */}
      <section className="container py-5 fade-section">
        <h3 className="fw-bold mb-3 text-center">Operational Overview</h3>
        <p className="text-muted text-center px-md-5">
          The Hospital Equipment Maintenance and Stock Management System follows
          a structured four-stage workflow model. Each stage ensures
          accountability, operational transparency, and systematic coordination
          between hospital administrative staff, maintenance teams, and
          inventory supervisors. The system minimizes equipment downtime,
          prevents stock shortages, and enhances data-driven decision-making
          through real-time analytics.
        </p>
      </section>

      {/* TIMELINE */}
      <section className="timeline-section container pb-5">
        <div className="timeline-line"></div>

        {/* Step 1 */}
        <div className="timeline-item left fade-section">
          <div className="timeline-content">
            <div className="timeline-number">01</div>
            <h5>Equipment Registration & Categorization</h5>
            <p>
              Hospital administrators register equipment details including
              category, condition, acquisition date, and department allocation.
              This centralized database ensures traceability and lifecycle
              tracking.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="timeline-item right fade-section">
          <div className="timeline-content">
            <div className="timeline-number">02</div>
            <h5>Preventive Maintenance Scheduling</h5>
            <p>
              The system automatically schedules preventive maintenance
              intervals and records maintenance history to reduce unexpected
              equipment failure.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="timeline-item left fade-section">
          <div className="timeline-content">
            <div className="timeline-number">03</div>
            <h5>Real-Time Alerts & Notifications</h5>
            <p>
              Automated alerts notify responsible personnel about due
              maintenance, low stock levels, or urgent technical issues
              requiring immediate action.
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="timeline-item right fade-section">
          <div className="timeline-content">
            <div className="timeline-number">04</div>
            <h5>Reporting & Strategic Analysis</h5>
            <p>
              Analytical reports and performance dashboards provide actionable
              insights for strategic planning, budgeting, and resource
              optimization.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
