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

const mockTasks = [
  { id: 1, status: "completed", dueDate: "2026-02-21" },
  { id: 2, status: "in-progress", dueDate: "2026-02-28" },
  { id: 3, status: "pending", dueDate: "2026-03-05" },
];

const Overview = () => {
  const [tasks, setTasks] = useState([]);
  const [backendFailed, setBackendFailed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/api/tasks");
        setTasks(res.data);
        setBackendFailed(false);
      } catch (error) {
        setTasks(mockTasks);
        setBackendFailed(true);
      }
    };

    fetchTasks();

    const interval = setInterval(() => {
      fetchTasks();
    }, 30000); // refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status !== "completed").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const overdue = tasks.filter(
    (t) => t.status !== "completed" && new Date(t.dueDate) < new Date(),
  ).length;

  const chartData = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
    { name: "In-Progress", value: inProgress },
    { name: "Overdue", value: overdue },
  ];

  const actionCards = [
    {
      title: "Report Equipment Issue",
      desc: "Report equipment needing replacement or immediate attention",
      onClick: () => navigate("/report"),
      color: "#0d6efd",
    },
    {
      title: "View Assigned Tasks",
      desc: "Check your current tasks and update status",
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

  const generateWeeklyData = (tasks) => {
    const last7Days = [...Array(7)]
      .map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d;
      })
      .reverse();

    const weeklyData = last7Days.map((date) => {
      const formatted = date.toISOString().split("T")[0];

      const count = tasks.filter(
        (t) =>
          t.status === "completed" &&
          t.completedDate &&
          t.completedDate.startsWith(formatted),
      ).length;

      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        count,
      };
    });

    const total = weeklyData.reduce((sum, d) => sum + d.count, 0);

    return [...weeklyData, { day: "Total", count: total }];
  };

  const productivity =
    tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div className="overview-container">
      {backendFailed && (
        <div className="alert alert-warning">
          Backend failed, using mock data!
        </div>
      )}

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        {chartData.map((item) => (
          <div key={item.name} className="col-md-3 col-sm-6">
            <div className="card td-card p-2 shadow-sm">
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

      <div className="card productivity-card p-3 shadow-sm mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-1">Productivity</h6>
            <small className="text-muted">
              Based on completed vs assigned tasks
            </small>
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

      {/* Weekly Completion Trend */}
      <div className="card trend-card p-3 shadow-sm mb-4">
        <h6 className="mb-3">Weekly Task Completion</h6>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={generateWeeklyData(tasks)}>
            <XAxis dataKey="day" tick={{ fontSize: 12 }} />
            <YAxis hide />
            <Tooltip />
            <Bar dataKey="count" fill="#0d6efd" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
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
