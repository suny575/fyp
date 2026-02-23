
import React, { useState, useEffect } from "react";
import { useNavigate,useLocation } from "react-router-dom";
import "../styles/ManagersList.css";

// import { useLocation } from "react-router-dom";


const ManagersList = () => {
  const navigate = useNavigate();
  const location = useLocation(); 

  // Sample managers data (replace with API call later)
  const [managers, setManagers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "Inactive" },
    { id: 3, name: "Mark Wilson", email: "mark@example.com", status: "Active" },
  ]);



useEffect(() => {
  if (location.state?.newManager) {
    setManagers((prev) => {
      // 👉 CHECK IF MANAGER ALREADY EXISTS
      const exists = prev.some(
        (m) => m.id === location.state.newManager.id
      );

      if (exists) return prev; // 👉 DO NOTHING IF EXISTS

      return [...prev, location.state.newManager];
    });

    // 👉 CLEAR ROUTER STATE
    navigate(location.pathname, { replace: true, state: {} });
  }

  if (location.state?.updatedManager) {
    setManagers((prev) =>
      prev.map((m) =>
        m.id === location.state.updatedManager.id
          ? location.state.updatedManager
          : m
      )
    );

    navigate(location.pathname, { replace: true, state: {} });
  }
}, [location.state, location.pathname, navigate]);



  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Filter & search logic
  const filteredManagers = managers.filter((manager) => {
    const matchesSearch = manager.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "All" ? true : manager.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Toggle manager status
  const toggleStatus = (id) => {
    setManagers((prev) =>
      prev.map((manager) =>
        manager.id === id
          ? { ...manager, status: manager.status === "Active" ? "Inactive" : "Active" }
          : manager
      )
    );
  };

  return (
    <div className="managers-container">
      <h3>Maintenance Managers</h3>

      {/* Search & Filter */}
      <div className="managers-controls">
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <button
          className="add-manager-btn"
          onClick={() => navigate("/admin/managers/new")}
        >
          + Add New Manager
        </button>
      </div>

      {/* Managers Table */}
      <div className="table-wrapper">
      <table className="managers-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredManagers.map((manager) => (
            <tr key={manager.id}>
              <td>{manager.name}</td>
              <td>{manager.email}</td>
              <td>
                <span
                  className={`status-badge ${
                    manager.status === "Active" ? "active" : "inactive"
                  }`}
                >
                  {manager.status}
                </span>
              </td>
              <td>
   

                <button
                  className="toggle-btn"
                  onClick={() => toggleStatus(manager.id)}
                >
                  {manager.status === "Active" ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}

          {filteredManagers.length === 0 && (
            <tr>
              <td colSpan="4" style={{ textAlign: "center", padding: "15px" }}>
                No managers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default ManagersList;

