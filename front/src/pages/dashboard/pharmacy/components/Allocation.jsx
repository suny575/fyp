
// import axios from "axios";
// import React, { useState, useEffect } from "react";
// import "../styles/Allocation.css";

// const AllocationPage = ({ pharmacyUserId = "Pharmacy01" }) => {
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [showPending, setShowPending] = useState(false);
//   const [alert, setAlert] = useState({ type: "", message: "" });

//   // ===== Helper: get auth token from localStorage =====
//   const getAuthHeaders = () => {
//     const token = localStorage.getItem("token"); // or wherever you store it
//     return { Authorization: `Bearer ${token}` };
//   };

//   // ===== Fetch pending requests =====
//   const fetchPending = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/allocations/pending", {
//         headers: getAuthHeaders(),
//       });
//       setPendingRequests(res.data);
//     } catch (err) {
//       console.error(err);
//       setAlert({ type: "error", message: "Failed to fetch pending requests" });
//     }
//   };

//   // ===== Fetch allocation history =====
//   const fetchHistory = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/allocations/history", {
//         headers: getAuthHeaders(),
//       });
//       setHistory(res.data);
//     } catch (err) {
//       console.error(err);
//       setAlert({ type: "error", message: "Failed to fetch allocation history" });
//     }
//   };

//   // ===== On mount =====
//   useEffect(() => {
//     fetchPending();
//     fetchHistory();
//   }, []);

//   // ===== Approve / Reject handlers =====
//   const handleApprove = async (reqId) => {
//     try {
//       await axios.post(
//         `http://localhost:5000/api/allocations/approve/${reqId}`,
//         {},
//         { headers: getAuthHeaders() }
//       );
//       setAlert({ type: "success", message: "Stock approved" });
//       fetchPending();
//       fetchHistory();
//     } catch (err) {
//       console.error(err);
//       setAlert({ type: "error", message: err.response?.data?.message || "Failed to approve" });
//     }
//   };

//   const handleReject = async (reqId) => {
//     try {
//       await axios.post(
//         `http://localhost:5000/api/allocations/reject/${reqId}`,
//         {},
//         { headers: getAuthHeaders() }
//       );
//       setAlert({ type: "error", message: "Stock rejected" });
//       fetchPending();
//       fetchHistory();
//     } catch (err) {
//       console.error(err);
//       setAlert({ type: "error", message: err.response?.data?.message || "Failed to reject" });
//     }
//   };

//   const togglePending = () => setShowPending((prev) => !prev);

//   return (
//     <div className="allocation-page">
//       <h2>Allocation Management</h2>

//       {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}

//       <button className="allocate-toggle-btn" onClick={togglePending}>
//         {showPending ? "Hide Pending Requests" : "+ Pending Requests"}
//       </button>

//       {showPending && (
//         <div className="table-wrapper pending-table">
//           <h3>Pending Requests</h3>
//           <table>
//             <thead>
//               <tr>
//                 <th>Stock Item</th>
//                 <th>Requested Qty</th>
//                 <th>Requested By</th>
//                 <th>Department</th>
//                 <th>Available Qty</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {pendingRequests.map((req) => (
//                 <tr key={req.id}>
//                   <td>{req.itemName}</td>
//                   <td>{req.requestedQty}</td>
//                   <td>{req.requestedByName}</td>
//                   <td>{req.department}</td>
//                   <td>{req.availableQty}</td>
//                   <td>
//                     <button
//                       className="approve-btn"
//                       disabled={req.requestedQty > req.availableQty}
//                       onClick={() => handleApprove(req.id)}
//                     >
//                       Approve
//                     </button>
//                     <button className="reject-btn" onClick={() => handleReject(req.id)}>
//                       Reject
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <div className="table-wrapper history-table">
//         <h3>Allocation Records</h3>
//         <table>
//           <thead>
//             <tr>
//               <th>Type</th>
//               <th>Name</th>
//               <th>Department</th>
//               <th>Quantity</th>
//               <th>Allocated By</th>
//               <th>Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {history.map((h) => (
//               <tr key={h.id}>
//                 <td>{h.type}</td>
//                 <td>{h.name}</td>
//                 <td>{h.department}</td>
//                 <td>{h.quantity}</td>
//                 <td>{h.allocatedByName}</td>
//                 <td>{h.date}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AllocationPage;





import axios from "axios";
import React, { useState, useEffect } from "react";
import "../styles/Allocation.css";

const AllocationPage = ({ pharmacyUserId = "Pharmacy01" }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [history, setHistory] = useState([]);
  const [showPending, setShowPending] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // ===== Helper: get auth token from localStorage =====
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // Make sure token is stored after login
    return { Authorization: `Bearer ${token}` };
  };

  // ===== Fetch pending requests =====
  const fetchPending = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/allocations/pending", {
        headers: getAuthHeaders(),
      });
      setPendingRequests(res.data);
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Failed to fetch pending requests",
      });
    }
  };

  // ===== Fetch allocation history =====
  const fetchHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/allocations/history", {
        headers: getAuthHeaders(),
      });
      setHistory(res.data);
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Failed to fetch allocation history",
      });
    }
  };

  // ===== On mount =====
  useEffect(() => {
    fetchPending();
    fetchHistory();
  }, []);

  // ===== Approve / Reject handlers =====
  const handleApprove = async (reqId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/allocations/approve/${reqId}`,
        {}, // empty body
        { headers: getAuthHeaders() }
      );
      setAlert({ type: "success", message: "Stock approved" });
      fetchPending();
      fetchHistory();
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Failed to approve",
      });
    }
  };

  const handleReject = async (reqId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/allocations/reject/${reqId}`,
        {}, // empty body
        { headers: getAuthHeaders() }
      );
      setAlert({ type: "error", message: "Stock rejected" });
      fetchPending();
      fetchHistory();
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: err.response?.data?.message || "Failed to reject",
      });
    }
  };

  const togglePending = () => setShowPending((prev) => !prev);

  return (
    <div className="allocation-page">
      <h2>Allocation Management</h2>

      {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}

      <button className="allocate-toggle-btn" onClick={togglePending}>
        {showPending ? "Hide Pending Requests" : "+ Pending Requests"}
      </button>

      {showPending && (
        <div className="table-wrapper pending-table">
          <h3>Pending Requests</h3>
          <table>
            <thead>
              <tr>
                <th>Stock Item</th>
                <th>Requested Qty</th>
                <th>Requested By</th>
                <th>Department</th>
                <th>Available Qty</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((req) => (
                <tr key={req.id}>
                  <td>{req.itemName}</td>
                  <td>{req.requestedQty}</td>
                  <td>{req.requestedByName}</td>
                  <td>{req.department}</td>
                  <td>{req.availableQty}</td>
                  <td>
                    <button
                      className="approve-btn"
                      disabled={req.requestedQty > req.availableQty}
                      onClick={() => handleApprove(req.id)}
                    >
                      Approve
                    </button>
                    <button
                      className="reject-btn"
                      onClick={() => handleReject(req.id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="table-wrapper history-table">
        <h3>Allocation Records</h3>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Department</th>
              <th>Quantity</th>
              <th>Allocated By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {history.map((h) => (
              <tr key={h.id}>
                <td>{h.type}</td>
                <td>{h.name}</td>
                <td>{h.department}</td>
                <td>{h.quantity}</td>
                <td>{h.allocatedByName}</td>
                <td>{h.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllocationPage;
