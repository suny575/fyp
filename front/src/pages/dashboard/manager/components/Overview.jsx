import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Bar, Doughnut } from "react-chartjs-2";
import "../styles/overview.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { AuthContext } from "../../../../context/AuthContext.jsx"; // assuming you have AuthContext

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

const Overview = () => {
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [userOverview, setUserOverview] = useState([]);
  const [systemStats, setSystemStats] = useState([]);

  const handleViewIssues = async (statTitle) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/manager/issues?category=${encodeURIComponent(
          statTitle,
        )}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      const data = await res.json();
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  // FETCH DATA FROM BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersRes = await fetch(
          "http://localhost:5000/api/manager/users",
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const usersData = await usersRes.json();

        // Count users by role
        const technicians = usersData.filter(
          (u) => u.role === "technician",
        ).length;
        const depStaff = usersData.filter((u) => u.role === "depStaff").length;
        const pharmacy = usersData.filter(
          (u) => u.role === "pharmacyStore",
        ).length;

        setUserOverview([
          {
            title: "Technicians",
            count: technicians,
            route: "/manager/users",
          },
          { title: "Dep Staff", count: depStaff, route: "/manager/users" },
          {
            title: "Pharmacy Store",
            count: pharmacy,
            route: "/manager/users",
          },
        ]);

        // Fetch tasks
        const tasksRes = await fetch(
          "http://localhost:5000/api/tasks/allTasks",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const tasksData = await tasksRes.json();
        // Count tasks by status

        const waiting = tasksData.filter(
          (t) => t.status?.trim() === "waiting",
        ).length;
        const inProgress = tasksData.filter(
          (t) => t.status?.trim() === "inProgress",
        ).length;
        const completed = tasksData.filter(
          (t) => t.status?.trim() === "completed",
        ).length;

        setSystemStats([
          { title: "Waiting Tasks", value: waiting },
          { title: "In Progress Tasks", value: inProgress }, // display-friendly
          { title: "Completed Tasks", value: completed },
        ]);

        // If backend wraps tasks in `data` or `tasks`:
        const tasks = tasksData.tasks || tasksData; // fallback

        console.log("Tasks array for processing:", tasks);
        tasks.forEach((t, i) =>
          console.log(`Task ${i}: status='${t.status}'`, t),
        );
      } catch (error) {
        console.error("Error fetching overview data:", error);
      }
    };

    fetchData();
  }, [token]);

  // CHART DATA
  const barData = {
    labels: ["Waiting", "InProgress", "Completed"],
    datasets: [
      {
        label: "Tasks",
        data: systemStats.map((s) => s.value),
        backgroundColor: "#0d6efd",
        borderRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: userOverview.map((u) => u.title),
    datasets: [
      {
        data: userOverview.map((u) => u.count),
        backgroundColor: ["#0d6efd", "#20c997", "#ffc107"],
      },
    ],
  };

  return (
    <div className="overview-container container-fluid py-4">
      {/* USER OVERVIEW */}
      <h5 className="section-title mb-3">User Overview</h5>
      <div className="row g-4 mb-5">
        {userOverview.map((user, index) => (
          <div key={index} className="col-12 col-md-6 col-lg-4">
            <div className="card user-card shadow-sm">
              <div className="card-body text-center">
                <h6>{user.title}</h6>
                <h2 className="fw-bold">{user.count}</h2>
                <button
                  className="btn btn-outline-primary btn-sm mt-2"
                  onClick={() => navigate(user.route)}
                >
                  {user.title}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* SYSTEM STATS */}
      <h5 className="section-title mb-3">System Overview</h5>
      <div className="row g-4 mb-5">
        {systemStats.map((stat, index) => (
          <div key={index} className="col-12 col-sm-6 col-lg-3">
            <div className="card stat-card text-black shadow-sm p-3">
              <h6>{stat.title}</h6>
              <h3>{stat.value}</h3>
              <button
                className="btn btn-info btn-sm mt-3"
                onClick={() => handleViewIssues(stat.title)}
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="row g-4 mb-5">
        <div className="col-12 col-lg-8">
          <div className="card chart-card shadow-sm p-3">
            <h6>Task Status Overview</h6>
            <Bar data={barData} />
          </div>
        </div>
        <div className="col-12 col-lg-4">
          <div className="card chart-card shadow-sm p-3">
            <h6>User Distribution</h6>
            <Doughnut data={doughnutData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
