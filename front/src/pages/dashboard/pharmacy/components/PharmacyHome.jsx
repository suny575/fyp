import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PharmacyHome.css";
import { getStoredToken } from "../../../../utils/authStorage.js";

const PharmacyHome = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = getStoredToken();

      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      try {
        setError("");
        const res = await fetch("https://fyp-dle0.onrender.com/api/pharmacy/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard:", error);
        setError("Failed to load pharmacy dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);
  const resolvedData = dashboardData || {};

  const cards = [
    {
      title: "Total Equipment",
      count: resolvedData.totalEquipment,
      description: "All registered equipment in the pharmacy",
      link: "/pharmacy/equipment",
    },
    {
      title: "Total Stock Items",
      count: resolvedData.totalStock,
      description: "Consumables, spare parts, and accessories",
      link: "/pharmacy/stock",
    },
    {
      title: "Low Stock Items",
      count: resolvedData.lowStock,
      description: "Items that need restocking soon",
      link: "/pharmacy/alerts",
    },
    {
      title: "Expired Items",
      count: resolvedData.expired,
      description: "Consumables that already expired",
      link: "/pharmacy/alerts",
    },
    {
      title: "Total Allocations",
      count: resolvedData.totalAllocations,
      description: "Assignments to departments",
      link: "/pharmacy/allocation",
    },
    {
      title: "Reports",
      count: resolvedData.totalReports,
      description: "Inventory and usage reports",
      link: "/pharmacy/reports",
    },
  ];

  return (
    <div className="pharmacy-home-container">
      <h3>Pharmacy Dashboard</h3>
      {loading ? <p className="dashboard-status">Loading dashboard cards...</p> : null}
      {error ? <p className="dashboard-status error">{error}</p> : null}

      <div className="dashboard-cards">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`dashboard-card ${loading ? "is-loading" : ""}`}
          >
            <h3>{card.title}</h3>
            <p className={`card-count ${loading ? "loading" : ""}`}>
              {loading ? "Loading..." : card.count ?? 0}
            </p>
            <p className="card-desc">{card.description}</p>
            <button onClick={() => navigate(card.link)}>View Details</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PharmacyHome;

