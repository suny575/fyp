
// import React, { useState } from "react";
// import "../styles/SystemLogs.css";


// const SystemLogs = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [typeFilter, setTypeFilter] = useState("All");
//   const [severityFilter, setSeverityFilter] = useState("All");
//   const [selectedLog, setSelectedLog] = useState(null); // 👈 NEW

//   const logs = [
//     {
//       id: 1,
//       time: "10:30 AM",
//       type: "Security",
//       severity: "High",
//       description: "Failed login attempt",
//       user: "System",
//       details: "Multiple failed login attempts detected from IP 192.168.0.12",
//     },
//     {
//       id: 2,
//       time: "09:50 AM",
//       type: "Manager",
//       severity: "Low",
//       description: "New manager registered",
//       user: "Admin",
//       details: "Admin registered a new maintenance manager account.",
//     },
//     {
//       id: 3,
//       time: "09:15 AM",
//       type: "System",
//       severity: "Medium",
//       description: "Backup completed",
//       user: "System",
//       details: "Daily system backup completed successfully.",
//     },
//   ];

//   const filteredLogs = logs.filter((log) => {
//     const matchesSearch =
//   log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   log.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   log.severity.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
//   log.time.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesType =
//       typeFilter === "All" ? true : log.type === typeFilter;
//     const matchesSeverity =
//       severityFilter === "All" ? true : log.severity === severityFilter;

//     return matchesSearch && matchesType && matchesSeverity;
//   });

//   return (
//     <div className="logs-container">
//       <div className="logs-header">
//         <h2>System Logs</h2>

//         <div className="logs-controls">
//           <input
//             type="text"
//             placeholder="Search logs..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />

//           <select
//             value={typeFilter}
//             onChange={(e) => setTypeFilter(e.target.value)}
//           >
//             <option value="All">All Types</option>
//             <option value="Security">Security</option>
//             <option value="Manager">Manager</option>
//             <option value="System">System</option>
//           </select>

//           <select
//             value={severityFilter}
//             onChange={(e) => setSeverityFilter(e.target.value)}
//           >
//             <option value="All">All Severity</option>
//             <option value="Low">Low</option>
//             <option value="Medium">Medium</option>
//             <option value="High">High</option>
//           </select>
//         </div>
//       </div>

//       <div className="logs-table-wrapper">
//         <table className="logs-table">
//           <thead>
//             <tr>
//               <th>Time</th>
//               <th>Type</th>
//               <th>Severity</th>
//               <th>Description</th>
//               <th>Performed By</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredLogs.map((log) => (
//               <tr
//                 key={log.id}
//                 onClick={() => setSelectedLog(log)}  // 👈 CLICK HERE
//                 className="clickable-row"
//               >
//                 <td>{log.time}</td>
//                 <td>{log.type}</td>
//                 <td>
//                   <span
//                     className={`severity-badge ${log.severity.toLowerCase()}`}
//                   >
//                     {log.severity}
//                   </span>
//                 </td>
//                 <td>{log.description}</td>
//                 <td>{log.user}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* MODAL */}
//       {selectedLog && (
//         <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
//           <div
//             className="modal-content"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <h3>Log Details</h3>
//             <p><strong>Time:</strong> {selectedLog.time}</p>
//             <p><strong>Type:</strong> {selectedLog.type}</p>
//             <p><strong>Severity:</strong> {selectedLog.severity}</p>
//             <p><strong>Description:</strong> {selectedLog.description}</p>
//             <p><strong>Performed By:</strong> {selectedLog.user}</p>
//             <p><strong>Details:</strong> {selectedLog.details}</p>

//             <button
//               className="close-btn"
//               onClick={() => setSelectedLog(null)}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SystemLogs;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import "../styles/SystemLogs.css";

// const SystemLogs = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [typeFilter, setTypeFilter] = useState("All");
//   const [severityFilter, setSeverityFilter] = useState("All");
//   const [selectedLog, setSelectedLog] = useState(null);
//   const [logs, setLogs] = useState([]);

//   // Fetch logs from backend
//   useEffect(() => {
//     const fetchLogs = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/admin/system-logs");
//         // Convert time to readable string for table
//         const formattedLogs = res.data.map((log) => ({
//           ...log,
//           time: new Date(log.time).toLocaleString(),
//         }));
//         setLogs(formattedLogs);
//       } catch (error) {
//         console.error("Error fetching logs:", error);
//       }
//     };

//     fetchLogs();
//   }, []);

//   const filteredLogs = logs.filter((log) => {
//     const matchesSearch =
//       log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       log.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       log.severity.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       log.time.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesType = typeFilter === "All" ? true : log.type === typeFilter;
//     const matchesSeverity = severityFilter === "All" ? true : log.severity === severityFilter;

//     return matchesSearch && matchesType && matchesSeverity;
//   });

//   return (
//     <div className="logs-container">
//       <div className="logs-header">
//         <h2>System Logs</h2>

//         <div className="logs-controls">
//           <input
//             type="text"
//             placeholder="Search logs..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//           />

//           <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
//             <option value="All">All Types</option>
//             <option value="Security">Security</option>
//             <option value="Manager">Manager</option>
//             <option value="System">System</option>
//           </select>

//           <select value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
//             <option value="All">All Severity</option>
//             <option value="Low">Low</option>
//             <option value="Medium">Medium</option>
//             <option value="High">High</option>
//           </select>
//         </div>
//       </div>

//       <div className="logs-table-wrapper">
//         <table className="logs-table">
//           <thead>
//             <tr>
//               <th>Time</th>
//               <th>Type</th>
//               <th>Severity</th>
//               <th>Description</th>
//               <th>Performed By</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredLogs.map((log) => (
//               <tr
//                 key={log._id || log.id}
//                 onClick={() => setSelectedLog(log)}
//                 className="clickable-row"
//               >
//                 <td>{log.time}</td>
//                 <td>{log.type}</td>
//                 <td>
//                   <span className={`severity-badge ${log.severity.toLowerCase()}`}>
//                     {log.severity}
//                   </span>
//                 </td>
//                 <td>{log.description}</td>
//                 <td>{log.user}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {selectedLog && (
//         <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h3>Log Details</h3>
//             <p><strong>Time:</strong> {selectedLog.time}</p>
//             <p><strong>Type:</strong> {selectedLog.type}</p>
//             <p><strong>Severity:</strong> {selectedLog.severity}</p>
//             <p><strong>Description:</strong> {selectedLog.description}</p>
//             <p><strong>Performed By:</strong> {selectedLog.user}</p>
//             <p><strong>Details:</strong> {selectedLog.details}</p>

//             <button className="close-btn" onClick={() => setSelectedLog(null)}>
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SystemLogs;

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/SystemLogs.css";

const SystemLogs = () => {
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [selectedLog, setSelectedLog] = useState(null);

  const [typeOptions, setTypeOptions] = useState([]);
  const [severityOptions, setSeverityOptions] = useState([]);

  // Fetch logs from backend
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/system-logs");
        setLogs(res.data.logs || []);

        // Populate dropdowns dynamically
        const types = [...new Set(res.data.logs.map((log) => log.type))];
        const severities = [...new Set(res.data.logs.map((log) => log.severity))];
        setTypeOptions(types);
        setSeverityOptions(severities);

      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };

    fetchLogs();
  }, []);

  // Filter logs based on search, type, and severity
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.severity.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      new Date(log.time).toLocaleString().toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter === "All" ? true : log.type === typeFilter;
    const matchesSeverity = severityFilter === "All" ? true : log.severity === severityFilter;

    return matchesSearch && matchesType && matchesSeverity;
  });

  return (
    <div className="logs-container">
      <div className="logs-header">
        <h2>System Logs</h2>
        <div className="logs-controls">
          <input
            type="text"
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="All">All Types</option>
            {typeOptions.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="All">All Severity</option>
            {severityOptions.map((sev) => (
              <option key={sev} value={sev}>{sev}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="logs-table-wrapper">
                <table className="logs-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Type</th>
              <th>Severity</th>
              <th>Description</th>
              <th>Performed By</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log) => (
              <tr
                key={log._id || log.id}
                onClick={() => setSelectedLog(log)}
                className="clickable-row"
              >
                {/* <td>{new Date(log.time).toLocaleString()}</td> */}
        <td>
  {log.createdAt
    ? new Date(log.createdAt).toLocaleString()
    : "—"}
</td>
                <td>{log.type}</td>
                <td>
                  <span className={`severity-badge ${log.severity.toLowerCase()}`}>
                    {log.severity}
                  </span>
                </td>
                <td>{log.description}</td>
                <td>{log.user}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {selectedLog && (
        <div className="modal-overlay" onClick={() => setSelectedLog(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Log Details</h3>
            {/* <p><strong>Time:</strong> {new Date(selectedLog.time).toLocaleString()}</p> */}
            <p>
  <strong>Time:</strong>{" "}
  {selectedLog.createdAt
    ? new Date(selectedLog.createdAt).toLocaleString()
    : "—"}
</p>
            <p><strong>Type:</strong> {selectedLog.type}</p>
            <p><strong>Severity:</strong> {selectedLog.severity}</p>
            <p><strong>Description:</strong> {selectedLog.description}</p>
            <p><strong>Performed By:</strong> {selectedLog.user}</p>
            <p><strong>Details:</strong> {selectedLog.details}</p>

            <button className="close-btn" onClick={() => setSelectedLog(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemLogs;