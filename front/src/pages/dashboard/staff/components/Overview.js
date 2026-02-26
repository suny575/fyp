// Overview.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Overview = () => {
  const [faults, setFaults] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchFaults = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/faults", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;

        setFaults(data);

        const pending = data.filter(
          (fault) => fault.status === "pending",
        ).length;

        setPendingCount(pending);
      } catch (err) {
        console.error(err);
        setError("Failed to load overview data");
      } finally {
        setLoading(false);
      }
    };

    fetchFaults();
  }, []);

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );

  if (error) return <div className="alert alert-danger m-3">{error}</div>;

  const recentFaults = faults.slice(0, 5);

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
        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Pending Faults</h6>
              <h2 className="fw-bold text-warning">{pendingCount}</h2>
              <small className="text-muted">
                Awaiting technician assignment
              </small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Stock Requests</h6>
              <h2 className="fw-bold text-primary">—</h2>
              <small className="text-muted">Backend not connected yet</small>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0">
            <div className="card-body">
              <h6 className="text-muted">Expiring Items</h6>
              <h2 className="fw-bold text-danger">—</h2>
              <small className="text-muted">Feature coming soon</small>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Faults */}
      <div className="card shadow-sm">
        <div className="card-header bg-white fw-bold">Recent Fault Reports</div>

        <div className="card-body p-0">
          {recentFaults.length === 0 ? (
            <div className="p-3 text-muted">No fault reports found.</div>
          ) : (
            <table className="table mb-0">
              <thead className="table-light">
                <tr>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentFaults.map((fault) => (
                  <tr key={fault._id}>
                    <td>{fault.description}</td>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
