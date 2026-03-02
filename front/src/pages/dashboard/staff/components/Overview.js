import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Overview = () => {
  const navigate = useNavigate();
  const [faults, setFaults] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [stockRequests, setStockRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const [faultRes, taskRes, stockRes] = await Promise.all([
          axios.get("http://localhost:5000/api/faults", {
            headers: { Authorization: `Bearer ${token}` },
          }),

          axios.get("http://localhost:5000/api/tasks", {
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
  }, [token]);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );

  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  const recentFaults = faults.slice(0, 10);
  const waitingCount = faults.filter((f) => f.status === "waiting").length;
  const inProgressCount = tasks.filter((t) => t.status === "inProgress").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  const stockRequestCount = stockRequests.length;

  return (
    <div>
      {/* Title */}
      <div className="mb-4">
        <h3 className="fw-bold">Department Overview</h3>
        <p className="text-muted">
          Monitor faults, stock requests, and equipment health.
        </p>
      </div>

      {/* Stats */}
      <div className="row g-4 mb-4">
        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Waiting Faults</h6>
              <h2 className="fw-bold text-warning">{waitingCount}</h2>
              <small className="text-muted">
                Awaiting technician assignment
              </small>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">In-progress Tasks</h6>
              <h2 className="fw-bold text-warning">{inProgressCount}</h2>
              <small className="text-muted">Tasks in progress</small>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">completed Tasks</h6>
              <h2 className="fw-bold text-warning">{completedCount}</h2>
              <small className="text-muted">Completed Tasks</small>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Stock Requests</h6>
              <h2 className="fw-bold text-primary">{stockRequestCount}</h2>
              <small className="text-muted">
                Total stock requests submitted
              </small>
            </div>
          </div>
        </div>

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
          {recentFaults.length === 0 ? (
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
                      key={faults._id}
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        navigate(`/staff/faults?highlight=${faults._id}`)
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
