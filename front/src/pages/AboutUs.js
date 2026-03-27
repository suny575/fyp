import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaBoxes,
  FaChartLine,
  FaClipboardCheck,
  FaHospital,
  FaShieldAlt,
  FaTools,
} from "react-icons/fa";
import "../styles/About.css";

const corePillars = [
  {
    icon: FaTools,
    title: "Asset reliability",
    text: "Keep biomedical equipment service-ready with preventive maintenance planning, repair visibility, and cleaner task ownership.",
  },
  {
    icon: FaBoxes,
    title: "Stock continuity",
    text: "Monitor spare parts and consumables in one place so critical departments do not slow down because of stock gaps.",
  },
  {
    icon: FaBell,
    title: "Priority alerts",
    text: "Surface due maintenance, low-stock warnings, and unresolved issues before they affect patient-facing operations.",
  },
  {
    icon: FaChartLine,
    title: "Operational insight",
    text: "Turn equipment records into decision support for budgeting, replacement planning, and department-level performance reviews.",
  },
];

const supportAreas = [
  "Imaging and diagnostics",
  "Theatre and recovery rooms",
  "Critical care and wards",
  "Laboratory and pharmacy stores",
];

const architectureFlow = [
  "Department teams log equipment status, incidents, and supply requests.",
  "Maintenance and inventory teams coordinate service tasks, schedules, and stock actions.",
  "Leadership reviews trends, compliance readiness, and lifecycle performance from one dashboard.",
];

const outcomes = [
  "Clear traceability for every equipment asset from registration to replacement.",
  "Faster coordination between biomedical engineering, stores, and clinical teams.",
  "More professional reporting for audits, planning meetings, and maintenance reviews.",
];

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
      { threshold: 0.15 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page">
      <section className="about-hero-shell">
        <div className="container">
          <div className="about-hero-grid">
            <div className="about-hero-copy fade-section">
              <span className="about-eyebrow">Biomedical Operations Platform</span>
              <h1>Built for hospitals that need dependable equipment readiness.</h1>
              <p>
                HEM & SMS brings equipment tracking, preventive maintenance, and
                inventory visibility into one professional workflow so hospital
                teams can protect uptime, accountability, and patient service.
              </p>

              <div className="about-highlight-list">
                <span>Centralized asset register</span>
                <span>Maintenance coordination</span>
                <span>Real-time stock awareness</span>
              </div>

              <div className="about-hero-actions">
                <Link className="about-primary-link" to="/contactus">
                  Talk to the team
                </Link>
                <Link className="about-secondary-link" to="/howitworks">
                  See the workflow
                </Link>
              </div>
            </div>

            <div className="about-hero-panel fade-section">
              <div className="about-panel-header">
                <FaHospital />
                <div>
                  <p>Operations snapshot</p>
                  <span>Designed for real hospital equipment environments</span>
                </div>
              </div>

              <div className="about-stat-grid">
                <div className="about-stat-card">
                  <strong>24/7</strong>
                  <span>equipment visibility</span>
                </div>
                <div className="about-stat-card">
                  <strong>1</strong>
                  <span>shared source of truth</span>
                </div>
                <div className="about-stat-card">
                  <strong>3</strong>
                  <span>connected workflows</span>
                </div>
                <div className="about-stat-card">
                  <strong>Audit</strong>
                  <span>ready records</span>
                </div>
              </div>

              <div className="about-hero-note">
                The platform supports the coordination of service histories,
                department allocation, stock movement, and action-oriented
                reporting in one secure environment.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="about-story-section">
        <div className="container">
          <div className="about-story-grid fade-section">
            <div className="about-story-card">
              <span className="about-section-tag">Why it matters</span>
              <h2>Hospitals need more than manual logs and scattered follow-up.</h2>
              <p>
                When equipment records live in notebooks, spreadsheets, or
                disconnected teams, maintenance gets delayed, stock decisions
                lose context, and leadership cannot see risk soon enough. This
                system creates a cleaner operational backbone for biomedical and
                supply activities.
              </p>
            </div>

            <div className="about-story-card about-story-list">
              <span className="about-section-tag">Coverage</span>
              <h2>Made for the spaces where equipment reliability matters most.</h2>
              <ul>
                {supportAreas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="about-pillars-section">
        <div className="container">
          <div className="about-section-heading fade-section">
            <span className="about-section-tag">Core capabilities</span>
            <h2>Professional tools for equipment, maintenance, and stock control.</h2>
          </div>

          <div className="about-pillar-grid">
            {corePillars.map(({ icon: Icon, title, text }) => (
              <article className="about-pillar-card fade-section" key={title}>
                <div className="about-pillar-icon">
                  <Icon />
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-architecture-section">
        <div className="container">
          <div className="about-section-heading fade-section">
            <span className="about-section-tag">System architecture</span>
            <h2>A workflow that connects departments, technical teams, and leadership.</h2>
          </div>

          <div className="about-architecture-flow">
            {architectureFlow.map((step, index) => (
              <div className="about-architecture-step fade-section" key={step}>
                <div className="about-architecture-badge">0{index + 1}</div>
                <p>{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-impact-section">
        <div className="container">
          <div className="about-impact-card fade-section">
            <div className="about-impact-copy">
              <span className="about-section-tag">Expected impact</span>
              <h2>Sharper control, stronger service culture, and smarter planning.</h2>
            </div>

            <div className="about-impact-list">
              {outcomes.map((item) => (
                <div className="about-outcome-item" key={item}>
                  <FaClipboardCheck />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="about-trust-strip">
              <div>
                <FaShieldAlt />
                <span>Controlled access</span>
              </div>
              <div>
                <FaClipboardCheck />
                <span>Traceable actions</span>
              </div>
              <div>
                <FaChartLine />
                <span>Decision-ready reporting</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
