import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Alerts.css";

const Alerts = () => {
  const navigate = useNavigate();

  // Dummy alerts for now
  const alerts = [
    {
      id: 1,
      type: "stock",
      name: "Surgical Gloves",
      message: "Low stock level",
      date: "2026-02-22",
    },
    {
      id: 2,
      type: "stock",
      name: "Syringe 5ml",
      message: "Batch expiring soon",
      date: "2026-02-20",
    },
    {
      id: 3,
      type: "equipment",
      name: "ECG Machine",
      message: "Maintenance due",
      date: "2026-02-18",
    },
  ];

  const handleCheck = (alert) => {
    if (alert.type === "equipment") {
      navigate(`/pharmacy/equipment?highlight=${alert.name}`);
    } else {
      navigate(`/pharmacy/stock?highlight=${alert.name}`);
    }
  };

  return (

    <div className="alerts-container">
  <h2>Alerts</h2>
  <p className="sub-text">Low stock & expiry </p>

  <div className="alerts-table-wrapper">
    <div className="alerts-table-scroll">
      <table>
        <thead>
          <tr>
            <th>Type</th>
            <th>Name</th>
            <th>Message</th>
            <th>Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {alerts.map((alert) => (
            <tr key={alert.id}>
              <td>{alert.type}</td>
              <td>{alert.name}</td>
              <td>{alert.message}</td>
              <td>{alert.date}</td>
              <td>
                <button
                  className="check-btn"
                  onClick={() => handleCheck(alert)}
                >
                  Check
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>
  
  );
};

export default Alerts;