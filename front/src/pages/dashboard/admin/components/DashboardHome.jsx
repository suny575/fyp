
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardHome.css";
const DashboardHome = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Total Managers",
      value: 12,
      path: "/admin/managers",
    },
    {
      title: "Active Managers",
      value: 9,
      path: "/admin/managers",
    },
    {
      title: "Inactive Managers",
      value: 3,
      path: "/admin/managers",
    },
    {
      title: "Critical Alerts",
      value: 2,
      path: "/admin/settings",
    },
    {
      title: "Reports Generated",
      value: 25,
      path: "/admin/reports",
    },
    {
      title: "Recent System Activity",
      value: 18,
      path: "/admin/system-logs",
    },
    {
      title: "System Alerts",
      value: 5,
      path: "/admin/notifications",
    },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">System Overview</h2>

      <div className="cards-grid">
        {cards.map((card, index) => (
          <div key={index} className="dashboard-card">
            <h3>{card.title}</h3>
            <h1>{card.value}</h1>
            <button onClick={() => navigate(card.path)}>
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHome;




