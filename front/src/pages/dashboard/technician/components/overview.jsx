import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/overview.css";

const Overview = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const TECH_ID = loggedInUser?._id;

  // Fetch tasks assigned to this technician
  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Filter tasks assigned to current technician
      const techTasks = res.data.filter(
        (t) => t.assignedTechnician && t.assignedTechnician._id === TECH_ID,
      );
      setTasks(techTasks);
    } catch (error) {
      console.error("Backend fetch failed:", error.message);
      setTasks([]);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(() => {
      fetchTasks();
    }, 40000); // refresh every 40s
    return () => clearInterval(interval);
  }, [token]);

  // Status counts
  const waiting = tasks.filter((t) => t.status === "waiting").length;
  const pending = tasks.filter((t) => t.status === "pending").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const completed = tasks.filter((t) => t.status === "completed").length;

  const chartData = [
    { name: "Waiting", value: waiting },
    { name: "Pending", value: pending },
    { name: "In-Progress", value: inProgress },
    { name: "Completed", value: completed },
  ];

  // Action cards (overview clickable)
  const actionCards = [
    {
      title: "Report Equipment Issue",
      desc: "Report equipment needing attention",
      onClick: () => navigate("/report"),
      color: "#0d6efd",
    },
    {
      title: "View Assigned Tasks",
      desc: "Check your current tasks",
      onClick: () => navigate("/tasks"),
      color: "#198754",
    },
    {
      title: "View Notifications",
      desc: "Check recent notifications",
      onClick: () => navigate("/notifications"),
      color: "#ffc107",
    },
  ];

  const productivity =
    tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="overview-container">
      {/* Status KPI Cards */}
      <div className="row g-3 mb-4">
        {chartData.map((item) => (
          <div key={item.name} className="col-md-3 col-sm-6">
            <div
              className="card td-card p-2 shadow-sm"
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate(`/tasks?status=${item.name.toLowerCase()}`)
              }
            >
              <div className="card-body text-center">
                <h6 className="mb-2">{item.name}</h6>
                <h3 className="mb-2">{item.value}</h3>
                <div className="mini-bar-chart">
                  <ResponsiveContainer width="100%" height={30}>
                    <BarChart
                      data={[item]}
                      margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                    >
                      <XAxis dataKey="name" hide />
                      <YAxis hide />
                      <Tooltip />
                      <Bar
                        dataKey="value"
                        fill={
                          item.name === "Completed"
                            ? "#198754"
                            : item.name === "Pending"
                              ? "#ffc107"
                              : item.name === "In-Progress"
                                ? "#0d6efd"
                                : "#dc3545"
                        }
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Productivity */}
      <div className="card productivity-card p-3 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-1">Productivity</h6>
            <small className="text-muted">Completed vs assigned tasks</small>
          </div>
          <div
            className="progress-circle"
            style={{ "--percent": `${productivity}%` }}
          ></div>
        </div>
        <div className="progress mt-3" style={{ height: "6px" }}>
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${productivity}%` }}
          ></div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="row g-3">
        {actionCards.map((card) => (
          <div key={card.title} className="col-md-4 col-sm-6">
            <div
              className="card action-card p-3 text-white shadow-sm"
              style={{ backgroundColor: card.color, cursor: "pointer" }}
              onClick={card.onClick}
            >
              <h6>{card.title}</h6>
              <small>{card.desc}</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Overview;
