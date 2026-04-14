import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getStoredToken } from "../../../../utils/authStorage.js";

const Overview = () => {
  const navigate = useNavigate();
  const [faults, setFaults] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stockRequests, setStockRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = getStoredToken();

  useEffect(() => {
    const fetchOverviewData = async () => {
      if (!token) {
        setError("Authentication token not found.");
        setLoading(false);
        return;
      }

      try {
        setError("");
        const [faultRes, taskRes, stockRes] = await Promise.all([
          axios.get("http://localhost:5000/api/faults", {
            headers: { Authorization: `Bearer ${token}` },
          }),

          axios.get("http://localhost:5000/api/tasks/all", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/stock-requests", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setFaults(faultRes.data);
        setTasks(taskRes.data);
        setStockRequests(stockRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load overview data");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchOverviewData();
    else setLoading(false);
  }, [token]);

  const recentFaults = faults.slice(0, 10);
  const waitingCount = tasks.filter((f) => f.status === "waiting").length;
  const inProgressCount = tasks.filter((t) => t.status === "inProgress").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  const stockRequestCount = stockRequests.length;
  const statCards = [
    {
      title: "Waiting Faults",
      value: waitingCount,
      valueClass: "text-warning",
      helper: "Awaiting technician assignment",
    },
    {
      title: "In-progress Tasks",
      value: inProgressCount,
      valueClass: "text-warning",
      helper: "Tasks in progress",
    },
    {
      title: "completed Tasks",
      value: completedCount,
      valueClass: "text-warning",
      helper: "Completed Tasks",
    },
    {
      title: "Stock Requests",
      value: stockRequestCount,
      valueClass: "text-primary",
      helper: "Total stock requests submitted",
    },
  ];

  return (
    <div>
      {/* Title */}
      <div className="mb-4">
        <h3 className="fw-bold">Department Overview</h3>
        <p className="text-muted">
          Monitor faults, stock requests, and equipment health.
        </p>
        {loading ? <p className="text-muted mb-0">Loading overview cards...</p> : null}
        {error ? <div className="alert alert-danger mt-3 mb-0">{error}</div> : null}
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        {statCards.map((card) => (
          <div key={card.title} className="col-12 col-md-6">
            <div className="card shadow-sm border-0">
              <div className="card-body">
                <h6 className="text-muted">{card.title}</h6>
                <h2 className={`fw-bold ${card.valueClass}`}>
                  {loading ? "Loading..." : card.value}
                </h2>
                <small className="text-muted">{card.helper}</small>
              </div>
            </div>
          </div>
        ))}

        {/* <div className="col-12 col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Expiring Items</h6>
              <h2 className="fw-bold text-danger">—</h2>
              <small className="text-muted">Feature coming soon</small>
            </div>
          </div>
        </div> */}
      </div>

      {/* Recent Faults */}
      <div className="card shadow-sm">
        <div className="card-header bg-white fw-bold">Recent Fault Reports</div>
        <div className="card-body p-0">
          {loading ? (
            <div className="p-3 text-muted">Loading fault reports...</div>
          ) : recentFaults.length === 0 ? (
            <div className="p-3 text-muted">No fault reports found.</div>
          ) : (
            <div className="table-responsive">
              <table className="table mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentFaults.map((fault) => (
                    <tr
                      key={fault._id}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate(`/staff/faults?highlight=${fault._id}`)
                      }
                    >
                      <td>{fault.equipment?.name}</td>
                      <td>
                        <span
                          className={`badge ${
                            fault.status === "pending"
                              ? "bg-warning text-dark"
                              : fault.status === "completed"
                                ? "bg-success"
                                : "bg-primary"
                          }`}
                        >
                          {fault.status}
                        </span>
                      </td>
                      <td>{new Date(fault.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
