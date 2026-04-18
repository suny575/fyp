import React, { useCallback, useEffect, useState } from "react";
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
import { getStoredToken } from "../../../../utils/authStorage.js";

const normalizeTaskStatus = (status) => {
  const normalized = status?.trim();

  if (normalized === "in_progress") return "inProgress";

  return normalized;
};

const normalizeScheduledStatus = (status) => {
  const normalized = (status || "").toString().trim();

  if (normalized === "assigned" || normalized === "pending") return "waiting";
  if (normalized === "in_progress") return "inProgress";
  if (normalized === "completed") return "completed";

  return "waiting";
};

const Overview = () => {
  const [tasks, setTasks] = useState([]);
  const [scheduledTasks, setScheduledTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const token = getStoredToken();

  // Fetch tasks assigned to this technician
  const fetchTasks = useCallback(
    async ({ showLoading = false } = {}) => {
      if (showLoading) {
        setLoading(true);
      }

      try {
        const [faultTasksRes, scheduledTasksRes] = await Promise.all([
          axios.get("http://localhost:5000/api/tasks", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/workOrder", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setTasks(Array.isArray(faultTasksRes.data) ? faultTasksRes.data : []);
        setScheduledTasks(
          Array.isArray(scheduledTasksRes.data) ? scheduledTasksRes.data : [],
        );
        setError("");
      } catch (error) {
        console.error("Backend fetch failed:", error.message);
        setTasks([]);
        setScheduledTasks([]);
        setError("Failed to load technician overview.");
      } finally {
        if (showLoading) {
          setLoading(false);
        }
      }
    },
    [token],
  );

  useEffect(() => {
    if (!token) {
      setError("Authentication token not found.");
      setLoading(false);
      return;
    }

    fetchTasks({ showLoading: true });
    const interval = setInterval(() => {
      fetchTasks();
    }, 40000); // refresh every 40s
    return () => clearInterval(interval);
  }, [token, fetchTasks]);

  // Status counts
  const waiting =
    tasks.filter((t) => normalizeTaskStatus(t.status) === "waiting").length +
    scheduledTasks.filter(
      (task) => normalizeScheduledStatus(task.status) === "waiting",
    ).length;
  const inProgress =
    tasks.filter((t) => normalizeTaskStatus(t.status) === "inProgress").length +
    scheduledTasks.filter(
      (task) => normalizeScheduledStatus(task.status) === "inProgress",
    ).length;
  const completed =
    tasks.filter((t) => normalizeTaskStatus(t.status) === "completed").length +
    scheduledTasks.filter(
      (task) => normalizeScheduledStatus(task.status) === "completed",
    ).length;

  const chartData = [
    { name: "Waiting", value: waiting, sectionKey: "waiting" },
    { name: "In Progress", value: inProgress, sectionKey: "inProgress" },
    { name: "Completed", value: completed, sectionKey: "completed" },
  ];

  // Action cards (overview clickable)
  const actionCards = [
    {
      title: "Report Equipment Issue",
      desc: "Report equipment needing attention",
      onClick: () => navigate("/technician/report"),
      color: "#0d6efd",
    },
    {
      title: "View Assigned Tasks",
      desc: "Check your current tasks",
      onClick: () => navigate("/technician/tasks"),
      color: "#198754",
    },
    {
      title: "Scheduled Tasks",
      desc: "View tasks from scheduled maintenance",
      onClick: () =>
        navigate("/technician/tasks", {
          state: { focusSection: "scheduled" },
        }),
      color: "#0ea5e9",
    },
    {
      title: "View Notifications",
      desc: "Check recent notifications",
      onClick: () => navigate("/notifications"),
      color: "#ffc107",
    },
  ];

  const totalAssigned = waiting + inProgress + completed;
  const productivity =
    totalAssigned > 0 ? Math.round((completed / totalAssigned) * 100) : 0;

  return (
    <div className="overview-container">
      {loading ? (
        <p className="overview-banner">Loading overview cards...</p>
      ) : null}
      {error ? <p className="overview-banner error">{error}</p> : null}

      {/* Status KPI Cards */}
      <div className="row g-3 mb-4">
        {chartData.map((item) => (
          <div key={item.name} className="col-12 col-sm-6 col-lg-4">
            <div
              className={`card td-card p-2 shadow-sm ${loading ? "is-loading" : ""}`}
              style={{ cursor: "pointer" }}
              onClick={() =>
                navigate("/technician/tasks", {
                  state: { focusSection: item.sectionKey },
                })
              }
            >
              <div className="card-body text-center">
                <h6 className="mb-2">{item.name}</h6>
                <h3
                  className={`mb-2 ${loading ? "overview-number-loading" : ""}`}
                >
                  {loading ? "Loading..." : item.value}
                </h3>
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
                            : item.name === "Waiting"
                              ? "#ffc107"
                              : item.name === "In Progress"
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
      <div
        className={`card productivity-card p-3 shadow-sm mb-4 ${loading ? "is-loading" : ""}`}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-1">Productivity</h6>
            <small className="text-muted">
              {loading
                ? "Loading productivity..."
                : "Completed vs assigned tasks"}
            </small>
          </div>
          <div
            className="progress-circle"
            style={{ "--percent": `${loading ? 0 : productivity}%` }}
          >
            {loading ? "..." : `${productivity}%`}
          </div>
        </div>
        <div className="progress mt-3" style={{ height: "6px" }}>
          <div
            className="progress-bar bg-success"
            role="progressbar"
            style={{ width: `${loading ? 0 : productivity}%` }}
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
