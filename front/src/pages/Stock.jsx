import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/stock.css";

const Stock = () => {
  const [devices, setDevices] = useState([
    {
      deviceName: "ECG Machine",
      deviceID: "ECG-001",
      deviceCategory: "Medical Equipment",
      location: "Cardiology",
      description: "Used for monitoring heart activity",
    },
    {
      deviceName: "X-Ray Scanner",
      deviceID: "XR-102",
      deviceCategory: "Medical Equipment",
      location: "Radiology",
      description: "Used for imaging bones and organs",
    },
    {
      deviceName: "Ultrasound",
      deviceID: "US-300",
      deviceCategory: "Medical Equipment",
      location: "Maternity",
      description: "Ultrasound machine for fetal scanning",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newDevice, setNewDevice] = useState({
    deviceName: "",
    deviceID: "",
    deviceCategory: "",
    location: "",
    description: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setNewDevice({ ...newDevice, [e.target.id]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    Object.keys(newDevice).forEach((key) => {
      if (!newDevice[key].trim()) {
        newErrors[key] = "This field is required";
      }
    });
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setDevices([...devices, newDevice]);
    setNewDevice({
      deviceName: "",
      deviceID: "",
      deviceCategory: "",
      location: "",
      description: "",
    });
    setErrors({});
    setShowForm(false);
  };

  return (
    <div className="device-registration-page container">
      <h2 className="text-primary stitle mb-4">Hospital Device Inventory</h2>

      {/* Devices Table */}
      <table className="table devices-table mb-4">
        <thead className="table-dark">
          <tr>
            <th>Device Name</th>
            <th>Device ID</th>
            <th>Category</th>
            <th>Location</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((device, idx) => (
            <tr key={idx}>
              <td>{device.deviceName}</td>
              <td>{device.deviceID}</td>
              <td>{device.deviceCategory}</td>
              <td>{device.location}</td>
              <td>{device.description}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Add New Device Button */}
      <div className="text-end mb-3">
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          Add New Device
        </button>
      </div>

      {/* Inline Form */}
      {showForm && (
        <div className="registration-card shadow p-4 rounded mb-5">
          <h4 className="text-primary mb-3">Add New Device</h4>
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              <div className="col-md-6 mb-3">
                <label htmlFor="deviceName" className="form-label">
                  Device Name
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.deviceName ? "is-invalid" : ""
                  }`}
                  id="deviceName"
                  value={newDevice.deviceName}
                  onChange={handleChange}
                />
                {errors.deviceName && (
                  <div className="invalid-feedback">{errors.deviceName}</div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="deviceID" className="form-label">
                  Device ID / Serial
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.deviceID ? "is-invalid" : ""
                  }`}
                  id="deviceID"
                  value={newDevice.deviceID}
                  onChange={handleChange}
                />
                {errors.deviceID && (
                  <div className="invalid-feedback">{errors.deviceID}</div>
                )}
              </div>
            </div>

            <div className="row mb-3">
              <div className="col-md-6 mb-3">
                <label htmlFor="deviceCategory" className="form-label">
                  Category
                </label>
                <select
                  className={`form-select ${
                    errors.deviceCategory ? "is-invalid" : ""
                  }`}
                  id="deviceCategory"
                  value={newDevice.deviceCategory}
                  onChange={handleChange}
                >
                  <option value="">Choose category</option>
                  <option>Electronics</option>
                  <option>Networking</option>
                  <option>Medical Equipment</option>
                  <option>Office Equipment</option>
                </select>
                {errors.deviceCategory && (
                  <div className="invalid-feedback">
                    {errors.deviceCategory}
                  </div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label htmlFor="location" className="form-label">
                  Department / Location
                </label>
                <input
                  type="text"
                  className={`form-control ${
                    errors.location ? "is-invalid" : ""
                  }`}
                  id="location"
                  value={newDevice.location}
                  onChange={handleChange}
                />
                {errors.location && (
                  <div className="invalid-feedback">{errors.location}</div>
                )}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">
                Description
              </label>
              <textarea
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                id="description"
                rows={3}
                value={newDevice.description}
                onChange={handleChange}
              ></textarea>
              {errors.description && (
                <div className="invalid-feedback">{errors.description}</div>
              )}
            </div>

            <div className="text-end">
              <button
                type="button"
                className="btn btn-secondary me-2"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Device
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Stock;
