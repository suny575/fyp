
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/DashboardHome.css";
const DashboardHome = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [stats, setStats] = useState({
    totalManagers: 0,
    activeManagers: 0,
    inactiveManagers: 0,
    criticalAlerts: 0,
    systemAlerts: 0,
    reportsGenerated: 0,
    recentActivity: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/dashboard-stats", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setStats({
          totalManagers: res.data.managers?.total || 0,
          activeManagers: res.data.managers?.active || 0,
          inactiveManagers: res.data.managers?.inactive || 0,
          criticalAlerts: res.data.alerts?.critical || 0,
          systemAlerts: res.data.alerts?.system || 0,
          reportsGenerated: res.data.reportsGenerated || 0,
          // show total log count, not just last 5
          recentActivity: res.data.totalLogs ?? res.data.recentActivity?.length ?? 0,
        });
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Managers",
      value: stats.totalManagers,
      path: "/admin/managers",
    },
    {
      title: "Active Managers",
      value: stats.activeManagers,
      path: "/admin/managers",
    },
    {
      title: "Inactive Managers",
      value: stats.inactiveManagers,
      path: "/admin/managers",
    },
    {
      title: "Critical Alerts",
      value: stats.criticalAlerts,
      path: "/admin/settings",
    },
    {
      title: "Reports Generated",
      value: stats.reportsGenerated,
      path: "/admin/reports",
    },
    {
      title: "Recent System Activity",
      value: stats.recentActivity,
      path: "/admin/system-logs",
    },
    {
      title: "System Alerts",
      value: stats.systemAlerts,
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




