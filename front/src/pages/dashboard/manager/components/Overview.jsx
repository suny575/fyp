import React, { useState, useEffect } from "react";
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

  // STATES
  const [userOverview, setUserOverview] = useState([]);
  const [systemStats, setSystemStats] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  const [selectedStat, setSelectedStat] = useState(null);
  const [issues, setIssues] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const handleViewIssues = async (statTitle) => {
    try {
      const response = await fetch(
        `/api/manager/issues?category=${encodeURIComponent(statTitle)}`,
      );

      const data = response.ok
        ? await response.json()
        : [
            { id: 1, title: "AC Not Working", status: statTitle },
            { id: 2, title: "Network Issue", status: statTitle },
          ]; // fallback mock

      setIssues(data);
      setSelectedStat(statTitle);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  // MOCK DATA (used if backend fails / during development)
  const mockUserOverview = [
    { title: "Technicians", count: 12, route: "/manager/technician" },
    { title: "Dep Staff", count: 8, route: "/manager/depstaff" },
    { title: "Pharmacy Store", count: 5, route: "/manager/pharmacystore" },
  ];

  const mockSystemStats = [
    { title: "Pending Tasks", value: 6 },
    { title: "Completed Tasks", value: 24 },
    { title: "High Priority Issues", value: 3 },
    { title: "Active Reports", value: 4 },
  ];

  const mockRecentActivities = [
    "Assigned task to Technician A",
    "Department Staff reported AC issue",
    "Pharmacy logged new equipment request",
    "Generated monthly performance report",
  ];

  // FETCH DATA FROM BACKEND
  useEffect(() => {
    const fetchData = async () => {
      try {
        // USERS
        const resUsers = await fetch("/api/manager/user-overview");
        const dataUsers = (await resUsers.ok)
          ? await resUsers.json()
          : mockUserOverview;
        setUserOverview(dataUsers);

        // SYSTEM STATS
        const resStats = await fetch("/api/manager/system-stats");
        const dataStats = (await resStats.ok)
          ? await resStats.json()
          : mockSystemStats;
        setSystemStats(dataStats);

        // RECENT ACTIVITIES
        const resActivity = await fetch("/api/manager/recent-activity");
        const dataActivity = (await resActivity.ok)
          ? await resActivity.json()
          : mockRecentActivities;
        setRecentActivities(dataActivity);
      } catch (err) {
        console.error("Error fetching data, using mock data", err);
        // fallback to mock
        setUserOverview(mockUserOverview);
        setSystemStats(mockSystemStats);
        setRecentActivities(mockRecentActivities);
      }
    };

    fetchData();
  }, []);

  // CHART DATA
  const barData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [
      {
        label: "Completed Tasks",
        data: systemStats.length
          ? systemStats.map((s) => s.value) // simple map if dynamic
          : [5, 7, 4, 6, 8],
        backgroundColor: "#0d6efd",
        borderRadius: 6,
      },
    ],
  };

  const doughnutData = {
    labels: userOverview.map((u) => u.title) || [
      "Technicians",
      "Dept Staff",
      "Pharmacy",
    ],
    datasets: [
      {
        data: userOverview.map((u) => u.count) || [12, 8, 5],
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
                className="btn btn-primary btn-sm mt-3"
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
            <h6>Weekly Task Completion</h6>
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

      {/* RECENT ACTIVITY */}
      <div className="card activity-card shadow-sm p-4 mb-5">
        <div className="d-flex justify-content-between mb-3">
          <h6>Recent Activity</h6>
          <span className="badge bg-light text-dark">Today</span>
        </div>
        {recentActivities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className="activity-dot"></div>
            <div>
              <p className="mb-1">{activity}</p>
              <small className="text-muted">Just now</small>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title">{selectedStat} - Issues List</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>

              <div className="modal-body">
                {issues.length > 0 ? (
                  <ul className="list-group">
                    {issues.map((issue) => (
                      <li
                        key={issue.id}
                        className="list-group-item d-flex justify-content-between align-items-center"
                      >
                        {issue.title}
                        <span className="badge bg-primary">{issue.status}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted">No issues found.</p>
                )}
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
