

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ManagerForm.css";


const ManagerForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    status: "Active",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newManager = {
      id: Date.now(),
      ...formData,
    };

    // send data back to list page
    navigate("/admin/managers", {
      state: { newManager },
    });
  };

  return (
    <div className="manager-form-container">
      <h2>Add New Maintenance Manager</h2>

      <form onSubmit={handleSubmit} className="manager-form">
        <label>Name</label>
        <input
          type="text"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
        />

        <label>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <div className="form-buttons">
          <button type="submit" className="save-btn">
            Create Manager
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate("/admin/managers")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManagerForm;

