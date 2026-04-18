import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "../styles/ManagersList.css";
import ActionStatus from "../../../../components/feedback/ActionStatus.jsx";
import { getRequestFeedbackMessage } from "../../../../utils/requestFeedback.js";
import { getStoredToken } from "../../../../utils/authStorage.js";

const ManagersList = () => {
  const [showForm, setShowForm] = useState(false);
  const [managers, setManagers] = useState([]);
  const [loadingManagers, setLoadingManagers] = useState(true);
  const [email, setEmail] = useState("");
  const [hospital, setHospital] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteStatus, setInviteStatus] = useState("info");
  const [inviteMessage, setInviteMessage] = useState("");
  const token = getStoredToken();

  const fetchManagers = useCallback(async () => {
    setLoadingManagers(true);
    try {
      const res = await axios.get(
        "http://localhost:5000/api/admin/managers",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setManagers(res.data.managers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingManagers(false);
    }
  }, [token]);

  useEffect(() => {
    fetchManagers();
  }, [fetchManagers]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteStatus("info");
    setInviteMessage("Submitting invitation...");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/admin/invite-manager",
        { email, hospital },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setManagers((prev) => [...prev, res.data.manager]);
      setEmail("");
      setHospital("");
      setShowForm(false);
      setInviteStatus("success");
      setInviteMessage("Invitation submitted successfully.");
      fetchManagers();
    } catch (err) {
      console.error(err);
      setInviteStatus("error");
      setInviteMessage(
        getRequestFeedbackMessage(err, "Invitation submission failed."),
      );
    } finally {
      setInviteLoading(false);
    }
  };

  // ================= TOGGLE STATUS 
  const toggleStatus = async (managerId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      await axios.patch(
        `http://localhost:5000/api/admin/manager/${managerId}/status`,
        { status: newStatus } ,

        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setManagers((prev) =>
        prev.map((manager) =>
          manager._id === managerId
            ? {
                ...manager,
                status: newStatus
              }
            : manager,
        )
      );
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  const deleteManager = async (managerId) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/admin/manager/${managerId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setManagers((prev) => prev.filter((manager) => manager._id !== managerId));
    } catch (err) {
      console.error(err);
      alert("Error deleting manager");
    }
  };

  return (
    <div className="managers-container">
      <h3>Maintenance Managers</h3>

      <div className="top-controls">
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>
          + Invite Manager
        </button>
      </div>

      {showForm && (
        <div className="invite-form">
          <form onSubmit={handleInvite}>
            <h4>Invite Maintenance Manager</h4>
            <ActionStatus status={inviteStatus} message={inviteMessage} />
            <label>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label>Hospital</label>
            <input
              type="text"
              required
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              placeholder="Hospital name"
            />
            <label>Role</label>
            <input type="text" value="Maintenance Manager" readOnly />
            <div className="form-buttons">
              <button type="submit" className="send-btn" disabled={inviteLoading}>
                {inviteLoading ? "Sending Invitation..." : "Send Invitation"}
              </button>
              <button
                type="button"
                className="cancel-btn"
                disabled={inviteLoading}
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="managers-table-wrapper">
        {loadingManagers ? (
          <div className="page-loading">
            <div className="dotted-loader" />
            <p className="loading-text">Loading managers...</p>
          </div>
        ) : (
          <table className="managers-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Hospital</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {managers.map(
                (manager) =>
                  manager && (
                    <tr key={manager._id}>
                      <td>{manager.name || "-"}</td>
                      <td>{manager.email || "-"}</td>
                      <td>{manager.hospital || "-"}</td>
                      <td>{manager.role || "Maintenance Manager"}</td>
                      <td>
                        <span
                          className={`status ${
                            manager.status?.toLowerCase() || "pending"
                          }`}
                        >
                          {manager.status
                            ? manager.status.charAt(0).toUpperCase() +
                              manager.status.slice(1)
                            : "Pending"}
                        </span>
                      </td>
                      <td>
                        {manager.status === "pending" && (
                          <button
                            className="delete-btn"
                            onClick={() => deleteManager(manager._id)}
                          >
                            Delete
                          </button>
                        )}
                        {manager.status === "active" && (
                          <>
                            <button
                              className="deactivate-btn"
                              onClick={() =>
                                toggleStatus(manager._id, manager.status)
                              }
                            >
                              Deactivate
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => deleteManager(manager._id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                        {manager.status === "inactive" && (
                          <>
                            <button
                              className="activate-btn"
                              onClick={() =>
                                toggleStatus(manager._id, manager.status)
                              }
                            >
                              Activate
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => deleteManager(manager._id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ),
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ManagersList;
