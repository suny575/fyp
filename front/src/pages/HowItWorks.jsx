import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaBell,
  FaBoxes,
  FaChartLine,
  FaClipboardCheck,
  FaTools,
} from "react-icons/fa";
import "../styles/HowItWorks.css";

const workflowSteps = [
  {
    number: "01",
    title: "Register and classify equipment",
    text: "Each asset is recorded with department assignment, condition, maintenance status, and ownership context so nothing depends on memory alone.",
    owner: "Operations and biomedical teams",
  },
  {
    number: "02",
    title: "Plan preventive maintenance",
    text: "Service intervals and inspection tasks are scheduled early, helping technicians work from organized priorities instead of last-minute breakdowns.",
    owner: "Biomedical engineering",
  },
  {
    number: "03",
    title: "Track stock and supporting materials",
    text: "Consumables and spare items are monitored alongside equipment activity so service readiness is not blocked by low inventory.",
    owner: "Stores and inventory officers",
  },
  {
    number: "04",
    title: "Trigger alerts and action queues",
    text: "The system highlights overdue service, unresolved incidents, and stock risk so the right team can respond quickly and visibly.",
    owner: "Assigned support owners",
  },
  {
    number: "05",
    title: "Review reports and improve planning",
    text: "Managers can compare downtime patterns, maintenance completion, and stock movement to support procurement and operational planning.",
    owner: "Leadership and administrators",
  },
];

const commandCards = [
  {
    icon: FaTools,
    title: "Service coordination",
    text: "Maintenance tasks move from scheduling to execution with cleaner accountability.",
  },
  {
    icon: FaBoxes,
    title: "Inventory linkage",
    text: "Equipment and stock decisions stay connected instead of being handled in isolation.",
  },
  {
    icon: FaBell,
    title: "Active monitoring",
    text: "Operational alerts help teams act before problems become department-wide disruptions.",
  },
  {
    icon: FaChartLine,
    title: "Performance review",
    text: "Every action contributes to a stronger reporting picture for leadership.",
  },
];

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
      { threshold: 0.15 },
    );

    elements.forEach((element) => observer.observe(element));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="workflow-page">
      <section className="workflow-hero">
        <div className="container">
          <div className="workflow-hero-grid">
            <div className="workflow-hero-copy fade-section">
              <span className="workflow-eyebrow">How the system works</span>
              <h1>A smarter operational flow for hospital equipment management.</h1>
              <p>
                The platform follows a connected workflow from registration to
                maintenance planning, alerting, stock coordination, and
                executive reporting. It is designed to mirror how real hospital
                operations teams collaborate every day.
              </p>

              <div className="workflow-hero-actions">
                <Link className="workflow-primary-link" to="/contactus">
                  Request a walkthrough
                </Link>
                <Link className="workflow-secondary-link" to="/aboutus">
                  Learn about the platform
                </Link>
              </div>
            </div>

            <div className="workflow-hero-panel fade-section">
              <div className="workflow-mini-metric">
                <strong>5-stage flow</strong>
                <span>From asset registration to management reporting</span>
              </div>
              <div className="workflow-mini-metric">
                <strong>Shared ownership</strong>
                <span>Clinical, technical, and inventory teams stay aligned</span>
              </div>
              <div className="workflow-mini-metric">
                <strong>Action-first visibility</strong>
                <span>Alerts and dashboards turn records into decisions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="workflow-steps-section">
        <div className="container">
          <div className="workflow-section-heading fade-section">
            <span className="workflow-section-tag">Operational sequence</span>
            <h2>Each stage adds clarity, accountability, and response speed.</h2>
          </div>

          <div className="workflow-steps-grid">
            {workflowSteps.map((step) => (
              <article className="workflow-step-card fade-section" key={step.number}>
                <div className="workflow-step-header">
                  <span className="workflow-step-number">{step.number}</span>
                  <div>
                    <h3>{step.title}</h3>
                    <small>{step.owner}</small>
                  </div>
                </div>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="workflow-command-section">
        <div className="container">
          <div className="workflow-command-card fade-section">
            <div className="workflow-command-copy">
              <span className="workflow-section-tag">Command center view</span>
              <h2>Why the workflow feels smart in practice.</h2>
              <p>
                Instead of treating assets, service tasks, and stock as separate
                problems, the platform keeps them connected so teams can move
                faster with better context.
              </p>
            </div>

            <div className="workflow-command-grid">
              {commandCards.map(({ icon: Icon, title, text }) => (
                <div className="workflow-command-item" key={title}>
                  <Icon />
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="workflow-close-section">
        <div className="container">
          <div className="workflow-close-card fade-section">
            <FaClipboardCheck />
            <div>
              <h2>End result</h2>
              <p>
                Hospitals get a clearer picture of equipment readiness, stronger
                maintenance discipline, and more professional reporting for
                daily operations and long-term planning.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
