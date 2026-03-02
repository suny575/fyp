



// import React, { useState, useEffect } from "react";
// import "../styles/Alerts.css";
// import { useNavigate } from "react-router-dom";

// const AlertsPage = () => {
//   const navigate = useNavigate();

//   // 🔹 Alerts state
//   const [alerts, setAlerts] = useState([]);

//   // 🔹 Search / filter
//   const [searchTerm, setSearchTerm] = useState("");

//   // 🔹 Mock data (will replace with backend fetch later)
//   useEffect(() => {
//     const mockAlerts = [
//       {
//         id: 1,
//         type: "Expired Stock",
//         name: "Paracetamol",
//         message: "Stock expired",
//         date: "2026-02-15",
//         link: "/stock",
//       },
//       {
//         id: 2,
//         type: "Low Stock",
//         name: "Syringe 5ml",
//         message: "Stock quantity below threshold",
//         date: "2026-02-20",
//         link: "/stock",
//       },
//       {
//         id: 3,
//         type: "Pending Stock Request",
//         name: "Gloves",
//         message: "Request pending approval",
//         date: "2026-02-21",
//         link: "/allocation",
//       },
//     ];
//     setAlerts(mockAlerts);
//   }, []);

//   // 🔹 Filter alerts by search term
//   const filteredAlerts = alerts.filter(
//     (alert) =>
//       alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       alert.message.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <div className="alerts-container">
//       <h2>Alerts Dashboard</h2>
//       <p className="sub-text">
//         Keep track of expired stock, low stock, and pending requests
//       </p>

//       {/* Search Input */}
//       <div className="search-bar">
//         <input
//           type="text"
//           placeholder="Search alerts..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//         />
//       </div>

//       {/* Alerts Cards */}
//       <div className="alerts-grid">
//         {filteredAlerts.length > 0 ? (
//           filteredAlerts.map((alert) => (
//             <div key={alert.id} className={`alert-card ${alert.type.replace(/\s/g, "-").toLowerCase()}`}>
//               <h3>{alert.name}</h3>
//               <p className="alert-type">{alert.type}</p>
//               <p className="alert-message">{alert.message}</p>
//               <p className="alert-date">{new Date(alert.date).toLocaleDateString()}</p>
//               <button onClick={() => navigate(`/pharmacy${alert.link}`)}>Check</button>
//             </div>
//           ))
//         ) : (
//           <p className="no-alerts">No alerts found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AlertsPage;


import React, { useState, useEffect } from "react";
import "../styles/Alerts.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Fetch alerts from backend (or mock for now)
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/alerts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlerts(res.data);
      } catch (err) {
        console.error("Failed to fetch alerts:", err.message);
        // Mock data fallback
        setAlerts([
          { id: 1, type: "Expired Stock", name: "Paracetamol", message: "Expired stock found", date: "2026-02-15" },
          { id: 2, type: "Low Stock", name: "Syringe", message: "Stock below threshold", date: "2026-02-20" },
          { id: 3, type: "Pending Stock Request", name: "Face Masks", message: "Request pending approval", date: "2026-02-22" },
        ]);
      }
    };
    fetchAlerts();
  }, []);

  // Filter alerts by search
  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Badge color
  const getBadgeColor = (type) => {
    switch (type) {
      case "Expired Stock":
        return { backgroundColor: "#dc3545" }; // red
      case "Low Stock":
        return { backgroundColor: "#fd7e14" }; // orange
      case "Pending Stock Request":
        return { backgroundColor: "#ffc107", color: "#000" }; // yellow
      default:
        return { backgroundColor: "#6c757d" }; // gray
    }
  };

  // Button click navigation
  const handleCheck = (type) => {
    if (type === "Expired Stock" || type === "Low Stock") navigate("/pharmacy/stock");
    else if (type === "Pending Stock Request") navigate("/pharmacy/allocation");
  };

  return (
    <div className="alerts-container">
      <h2>Alerts</h2>

      <div className="alerts-search">
        <input
          type="text"
          placeholder="Search alerts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="alerts-grid">
        {filteredAlerts.map((alert) => (
          <div key={alert.id || alert._id} className="alert-card">
            <span className="alert-type" style={getBadgeColor(alert.type)}>
              {alert.type}
            </span>
            <h3>{alert.name}</h3>
            <p>{alert.message}</p>
            <span className="date">{new Date(alert.date).toLocaleDateString()}</span>
            <button onClick={() => handleCheck(alert.type)}>Check</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPage;