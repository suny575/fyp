import React, { useState } from "react";
import axios from "axios";
import "../styles/sm.css";

const token = localStorage.getItem("token");

const SetSchedule = ({ onScheduleCreated, equipments }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    equipment: "",
    frequency: "monthly",
    customIntervalDays: 30,
    startDate: "",
    priority: "medium",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const dataToSend = {
        equipment: formData.equipment,
        frequency: formData.frequency,
        startDate: formData.startDate,
        priority: formData.priority,
      };

      if (formData.frequency === "custom") {
        dataToSend.customIntervalDays = formData.customIntervalDays;
      }

      await axios.post("http://localhost:5000/api/schedules", dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Maintenance Schedule Created!");

      setShowForm(false);

      onScheduleCreated();
    } catch (error) {
      console.log("Schedule error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="mb-4">
      <button
        className="btn btn-blueblack mb-3"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Set Maintenance Schedule"}
      </button>

      {showForm && (
        <div className="card form-card shadow-sm p-4">
          <form onSubmit={handleSubmit} className="d-grid gap-3">
            <div className="form-group">
              <label className="fw-bold">Equipment:</label>
              <select
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select Equipment</option>
                {equipments.map((eq) => (
                  <option key={eq._id} value={eq._id}>
                    {eq.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="fw-bold">Frequency:</label>
              <select
                name="frequency"
                value={formData.frequency}
                onChange={handleChange}
                className="form-select"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom</option>
              </select>
            </div>

            {formData.frequency === "custom" && (
              <div className="form-group">
                <label className="fw-bold">Interval (Days):</label>
                <input
                  type="number"
                  name="customIntervalDays"
                  value={formData.customIntervalDays}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
            )}

            <div className="form-group">
              <label className="fw-bold">Start Date:</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="fw-bold">Priority:</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            <button type="submit" className="btn btn-blue mt-3">
              Save Schedule
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SetSchedule;
