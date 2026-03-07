
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/Notifications.css";


// const Notifications = () => {
//   const navigate = useNavigate();
//   const [activeTab, setActiveTab] = useState("Critical");

//   // Alerts stored in state
//   const [alerts, setAlerts] = useState([
//     { id: 1, type: "Critical", message: "Server crash detected", time: "10:30 AM" },
//     { id: 2, type: "Critical", message: "Unauthorized login attempt", time: "09:50 AM" },
//     { id: 3, type: "System", message: "New manager invited", time: "09:15 AM" },
//     { id: 4, type: "System", message: "Report generated", time: "08:40 AM" },
//     { id: 5, type: "Critical", message: "Database connection failure", time: "08:10 AM" },
//     { id: 6, type: "System", message: "Backup completed", time: "07:30 AM" },
//   ]);

//   // Filter alerts by tab
//   const filteredAlerts = alerts.filter(
//     (alert) => alert.type === activeTab
//   );

//   // Delete alert
//   const handleDelete = (id) => {
//     setAlerts((prev) => prev.filter((alert) => alert.id !== id));
//   };

//   return (
//     <div className="notifications-container">
//       <h3>Admin Notifications</h3>

//       {/* Tabs */}
//       <div className="notifications-tabs">
//         <button
//           className={activeTab === "Critical" ? "tab active" : "tab"}
//           onClick={() => setActiveTab("Critical")}
//         >
//           Critical Alerts
//         </button>

//         <button
//           className={activeTab === "System" ? "tab active" : "tab"}
//           onClick={() => setActiveTab("System")}
//         >
//           System Alerts
//         </button>
//       </div>

//       {/* Alerts List */}
//       <div className="alerts-list">
//         {filteredAlerts.length === 0 ? (
//           <p className="no-alerts">
//             No {activeTab.toLowerCase()} alerts.
//           </p>
//         ) : (
//           filteredAlerts.map((alert) => (
//             <div
//               key={alert.id}
//               className={`alert-card ${alert.type.toLowerCase()}`}
//             >
//               <div className="alert-info">
//                 <span className="alert-message">
//                   {alert.message}
//                 </span>
//                 <span className="alert-time">
//                   {alert.time}
//                 </span>
//               </div>

//               <div className="alert-actions">
                
//                 {/* Critical → Only Redirect */}
//                 {alert.type === "Critical" && (
//                   <button
//                     className="alert-action-btn"
//                     onClick={() => navigate("/admin/settings")}
//                   >
//                     Go to Settings
//                   </button>
//                 )}

//                 {/* Trash Icon for both */}
//                 <button
//                   className="alert-trash-btn"
//                   onClick={() => handleDelete(alert.id)}
//                 >
//                   🗑
//                 </button>

//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Notifications;



import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Notifications.css";

const Notifications = () => {
  const [activeTab, setActiveTab] = useState("Critical");
  const [alerts, setAlerts] = useState([]);

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/notifications");
      console.log(res.data.notifications);
      setAlerts(res.data.notifications);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Filter alerts by tab
  const filteredAlerts = alerts.filter((alert) => alert.type === activeTab);

  // Delete alert
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/admin/notifications/${id}`);
      setAlerts((prev) => prev.filter((alert) => alert._id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
      alert("Error deleting notification");
    }
  };

  return (
    <div className="notifications-container">
      <h3>Admin Notifications</h3>

      {/* Tabs */}
      <div className="notifications-tabs">
        <button
          className={activeTab === "Critical" ? "tab active" : "tab"}
          onClick={() => setActiveTab("Critical")}
        >
          Critical Alerts
        </button>

        <button
          className={activeTab === "System" ? "tab active" : "tab"}
          onClick={() => setActiveTab("System")}
        >
          System Alerts
        </button>
      </div>

      {/* Alerts List */}
      <div className="alerts-list">
        {filteredAlerts.length === 0 ? (
          <p className="no-alerts">No {activeTab.toLowerCase()} alerts.</p>
        ) : (
          filteredAlerts.map((alert) => (
            <div key={alert._id} className={`alert-card ${alert.type.toLowerCase()}`}>
              <div className="alert-info">
                <span className="alert-message">{alert.message}</span>
                <span className="alert-time">{new Date(alert.createdAt).toLocaleString()}</span>
              </div>

              <div className="alert-actions">
                {/* Critical → Only Redirect */}
                {alert.type === "Critical" && (
                  <button
                    className="alert-action-btn"
                    onClick={() => window.location.href = "/admin/settings"}
                  >
                    Go to Settings
                  </button>
                )}

                {/* Trash Icon for both */}
                <button
                  className="alert-trash-btn"
                  onClick={() => handleDelete(alert._id)}
                >
                  🗑
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;