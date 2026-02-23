// src/components/DepStaffTaskForm.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../../../src/context/AuthContext";

const DepStaffTaskForm = () => {
  const { user, token } = useContext(AuthContext); // JWT + user info
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department: "",
    priority: "medium",
  });
  const [loading, setLoading] = useState(false);
  const [assignedTech, setAssignedTech] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    setAssignedTech(null);

    try {
      const res = await axios.post(
        "/api/tasks",
        { ...formData },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setSuccess("Task created successfully!");
      if (res.data.assignedTechnician) {
        setAssignedTech(
          res.data.assignedTechnician.name || "Technician assigned",
        );
      }
      setFormData({
        title: "",
        description: "",
        department: "",
        priority: "medium",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Create Maintenance Task</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      {assignedTech && (
        <div className="alert alert-info">
          Assigned Technician: <strong>{assignedTech}</strong>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Department</label>
          <input
            type="text"
            className="form-control"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Priority</label>
          <select
            className="form-select"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  );
};

export default DepStaffTaskForm;
