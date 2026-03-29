
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ManagersList.css";

const ManagersList = () => {
  const [showForm, setShowForm] = useState(false);
  const [managers, setManagers] = useState([]);
  const [email, setEmail] = useState("");

  // 🔄 Fetch all managers (pending + registered)
  const fetchManagers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/managers");
      setManagers(res.data.managers);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  // ================= INVITE MANAGER =================
  const handleInvite = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/invite-manager", { email });
      // Add new invitation to table
      setManagers(prev => [...prev, res.data.manager]);
      setEmail("");
      setShowForm(false);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400) alert(err.response.data.message);
      else alert("Error sending invitation");
    }
  };

  // ================= TOGGLE STATUS =================
  const toggleStatus = async (managerId, currentStatus) => {
    try {
      const newStatus = currentStatus === "active" ? "inactive" : "active";

      await axios.patch(
        `http://localhost:5000/api/admin/manager/${managerId}/status`,
        { status: newStatus }
      );

      setManagers(prev =>
        prev.map(m => (m._id === managerId ? { ...m, status: newStatus } : m))
      );
    } catch (err) {
      console.error(err);
      alert("Error updating status");
    }
  };

  // ================= DELETE MANAGER =================
  const deleteManager = async (managerId) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/manager/${managerId}`);
      setManagers(prev => prev.filter(m => m._id !== managerId));
    } catch (err) {
      console.error(err);
      alert("Error deleting manager");
    }
  };

  return (
    <div className="managers-container">
      <h3>Maintenance Managers</h3>

      <div className="top-controls">
        <button className="add-btn" onClick={() => setShowForm(!showForm)}>+ Invite Manager</button>
      </div>

      {showForm && (
        <div className="invite-form">
          <form onSubmit={handleInvite}>
            <h4>Invite Maintenance Manager</h4>
            <label>Email</label>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            <label>Role</label>
            <input type="text" value="Maintenance Manager" readOnly />
            <div className="form-buttons">
              <button type="submit" className="send-btn">Send Invitation</button>
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="managers-table-wrapper">
        <table className="managers-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {managers.map(manager => manager && (
              <tr key={manager._id}>
                <td data-label="Name">{manager.name || "-"}</td>
                <td data-label="Email">{manager.email || "-"}</td>
                <td data-label="Role">{manager.role || "Maintenance Manager"}</td>
                <td data-label="Status">
                  <span className={`status ${manager.status?.toLowerCase() || "pending"}`}>
                    {manager.status ? manager.status.charAt(0).toUpperCase() + manager.status.slice(1) : "Pending"}
                  </span>
                </td>
                <td data-label="Actions">
                  {manager.status === "pending" && (
                    <button className="delete-btn" onClick={() => deleteManager(manager._id)}>
                      Delete
                    </button>
                  )}
                  {manager.status === "active" && (
                    <>
                      <button className="deactivate-btn" onClick={() => toggleStatus(manager._id, manager.status)}>
                        Deactivate
                      </button>
                      <button className="delete-btn" onClick={() => deleteManager(manager._id)}>
                        Delete
                      </button>
                    </>
                  )}
                  {manager.status === "inactive" && (
                    <>
                      <button className="activate-btn" onClick={() => toggleStatus(manager._id, manager.status)}>
                        Activate
                      </button>
                      <button className="delete-btn" onClick={() => deleteManager(manager._id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagersList;
