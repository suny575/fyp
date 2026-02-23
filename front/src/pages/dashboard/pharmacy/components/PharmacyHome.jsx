import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PharmacyHome.css";

const PharmacyHome = () => {
  const navigate = useNavigate();

  // Dummy data for overview cards
  const dashboardData = [
    {
      title: "Total Equipment",
      count: 120,
      description: "All registered equipment in the pharmacy",
      link: "/pharmacy/equipment",
    },
    {
      title: "Total Stock Items",
      count: 340,
      description: "Consumables, spare parts, and accessories",
      link: "/pharmacy/stock",
    },
    {
      title: "Low Stock Items",
      count: 15,
      description: "Items that need restocking soon",
      link: "/pharmacy/alerts",
    },
    {
      title: "Expiring Soon",
      count: 8,
      description: "Consumables nearing expiry",
      link: "/pharmacy/alerts",
    },
    {
      title: "Recent Allocations",
      count: 25,
      description: "Assignments to departments",
      link: "/pharmacy/allocation",
    },
    {
      title: "Reports",
      count: 12,
      description: "Inventory and usage reports",
      link: "/pharmacy/reports",
    },
  ];

  return (
    <div className="pharmacy-home-container">
      <h3>Pharmacy Dashboard</h3>

      <div className="dashboard-cards">
        {dashboardData.map((card, index) => (
          <div key={index} className="dashboard-card">
            <h3>{card.title}</h3>
            <p className="card-count">{card.count}</p>
            <p className="card-desc">{card.description}</p>
            <button onClick={() => navigate(card.link)}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PharmacyHome;