

// import React, { useState, useEffect } from "react";
// import "../styles/Allocation.css";

// const AllocationPage = ({ pharmacyUserId = "Pharmacy01" }) => {
//   const [stockList, setStockList] = useState([
//     { id: 1, name: "Gloves", available: 500 },
//     { id: 2, name: "Syringes", available: 300 },
//     { id: 3, name: "Face Masks", available: 200 },
//   ]);

//   const [equipmentList, setEquipmentList] = useState([
//     { id: 1, name: "ECG Machine", department: "Cardiology" },
//     { id: 2, name: "Infusion Pump", department: "ICU" },
//   ]);

//   const [allocations, setAllocations] = useState([]);

//   const [formData, setFormData] = useState({
//     stockId: "",
//     department: "",
//     quantity: "",
//   });

//   const [availableStock, setAvailableStock] = useState(0);
//   const [alert, setAlert] = useState({ type: "", message: "" });
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedAllocationId, setSelectedAllocationId] = useState(null);

//   // NEW: show/hide stock allocation form
//   const [showForm, setShowForm] = useState(false);

//   // ================= HANDLERS =================
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));

//     if (name === "stockId") {
//       const stock = stockList.find((s) => s.id === parseInt(value));
//       setAvailableStock(stock ? stock.available : 0);
//     }
//   };

//   const toggleForm = () => {
//     setShowForm((prev) => !prev);
//   };

//   const handleAllocate = (e) => {
//     e.preventDefault();
//     const { stockId, department, quantity } = formData;

//     if (!stockId || !department || !quantity) {
//       setAlert({ type: "error", message: "Please fill all fields." });
//       return;
//     }

//     if (parseInt(quantity) <= 0) {
//       setAlert({ type: "error", message: "Quantity must be greater than 0." });
//       return;
//     }

//     if (parseInt(quantity) > availableStock) {
//       setAlert({ type: "error", message: "Insufficient stock available." });
//       return;
//     }

//     const stockItem = stockList.find((s) => s.id === parseInt(stockId));
//     const today = new Date().toISOString().split("T")[0];

//     const newAllocation = {
//       id: Date.now(),
//       type: "Stock",
//       name: stockItem.name,
//       department,
//       quantity: parseInt(quantity),
//       allocatedBy: pharmacyUserId,
//       date: today,
//     };

//     setAllocations((prev) => [newAllocation, ...prev]);

//     // Update available stock
//     setStockList((prev) =>
//       prev.map((s) =>
//         s.id === stockItem.id ? { ...s, available: s.available - quantity } : s
//       )
//     );

//     setFormData({ stockId: "", department: "", quantity: "" });
//     setAvailableStock(0);
//     setAlert({ type: "success", message: "Allocation deleted successfully!" });
//     setShowForm(false); // hide form after allocation
//   };

//   const handleDeleteClick = (id) => {
//     setSelectedAllocationId(id);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = () => {
//     const allocation = allocations.find((a) => a.id === selectedAllocationId);
//     if (allocation.type === "Stock") {
//       setStockList((prev) =>
//         prev.map((s) =>
//           s.name === allocation.name
//             ? { ...s, available: s.available + allocation.quantity }
//             : s
//         )
//       );
//     }
//     setAllocations((prev) =>
//       prev.filter((a) => a.id !== selectedAllocationId)
//     );
//     setShowDeleteModal(false);
//     setAlert({ type: "success", message: "Allocation deleted successfully!" });
//   };

//   const cancelDelete = () => setShowDeleteModal(false);

//   // AUTO-ADD equipment allocations (from equipment registration)
//   useEffect(() => {
//     const today = new Date().toISOString().split("T")[0];
//     const equipmentAllocations = equipmentList.map((eq) => ({
//       id: Date.now() + Math.random(),
//       type: "Equipment",
//       name: eq.name,
//       department: eq.department,
//       quantity: 1,
//       allocatedBy: pharmacyUserId,
//       date: today,
//     }));

//     setAllocations((prev) => [...equipmentAllocations, ...prev]);
//   }, []);

//   useEffect(() => {
//   if (alert.message) {
//     const timer = setTimeout(() => {
//       setAlert({ type: "", message: "" });
//     }, 2000); // disappears after 2 seconds

//     return () => clearTimeout(timer);
//   }
// }, [alert.message]);

//   return (
//     <div className="allocation-page">
//       <h2>Allocation Management</h2>
//       <p className="sub-text">Assign equipment and stock items to departments</p>

//       {alert.message && (
//         <div className={`alert ${alert.type}`}>{alert.message}</div>
//       )}

//       {/* NEW: Toggle Form Button */}
//       <button className="allocate-toggle-btn" onClick={toggleForm}>
//         {showForm ? "Hide Allocation Form" : "+ Allocate Stock"}
//       </button>

//       {/* STOCK ALLOCATION FORM */}
//       {showForm && (
//         <div className="allocation-form">
//           <h3>Allocate Stock Item</h3>
//           <form onSubmit={handleAllocate}>
//             <div className="form-row">
//               <label>Stock Item:</label>
//               <select
//                 name="stockId"
//                 value={formData.stockId}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Stock</option>
//                 {stockList.map((s) => (
//                   <option key={s.id} value={s.id}>
//                     {s.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="form-row">
//               <label>Department:</label>
//               <select
//                 name="department"
//                 value={formData.department}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Department</option>
//                 <option value="ICU">ICU</option>
//                 <option value="Cardiology">Cardiology</option>
//                 <option value="Pharmacy">Pharmacy</option>
//               </select>
//             </div>

//             <div className="form-row">
//               <label>Available Stock:</label>
//               <input type="number" value={availableStock} disabled />
//             </div>

//             <div className="form-row">
//               <label>Quantity to Assign:</label>
//               <input
//                 type="number"
//                 name="quantity"
//                 value={formData.quantity}
//                 onChange={handleChange}
//               />
//             </div>

//             <div className="form-row">
//               <label>Allocated By:</label>
//               <input type="text" value={pharmacyUserId} disabled />
//             </div>

//             <div className="form-row">
//               <label>Date:</label>
//               <input
//                 type="text"
//                 value={new Date().toISOString().split("T")[0]}
//                 disabled
//               />
//             </div>

//             <button type="submit" className="allocate-btn">
//               Allocate
//             </button>
//           </form>
//         </div>
//       )}

// {/* ALLOCATION RECORDS TABLE */}
// <div className="allocation-table-wrapper">
//   <h3>Allocation Records</h3>
//   <div className="allocation-table-scroll">
//     <table>
//       <thead>
//         <tr>
//           <th>Type</th>
//           <th>Name</th>
//           <th>Department</th>
//           <th>Quantity</th>
//           <th>Allocated By</th>
//           <th>Date</th>
//           <th>Actions</th>
//         </tr>
//       </thead>
//       <tbody>
//         {allocations.map((a) => (
//           <tr key={a.id}>
//             <td>{a.type}</td>
//             <td>{a.name}</td>
//             <td>{a.department}</td>
//             <td>{a.quantity}</td>
//             <td>{a.allocatedBy}</td>
//             <td>{a.date}</td>
//             <td>
//               <button
//                 className="delete-btn"
//                 onClick={() => handleDeleteClick(a.id)}
//               >
//                 Delete
//               </button>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// </div>



//       {/* DELETE CONFIRM MODAL */}
//       {showDeleteModal && (
//         <div className="modal-overlay">
//           <div className="confirm-modal">
//             <h3>Delete Allocation</h3>
//             <p>Are you sure you want to delete this allocation?</p>
//             <div className="modal-buttons">
//               <button className="delete-btn" onClick={confirmDelete}>
//                 Yes
//               </button>
//               <button onClick={cancelDelete}>No</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AllocationPage;

import React, { useState, useEffect } from "react";
import "../styles/Allocation.css";

const AllocationPage = ({ pharmacyUserId = "Pharmacy01" }) => {
  // ===== Mock Data =====
  const [pendingRequests, setPendingRequests] = useState([
    { id: 1, name: "Gloves", requestedQty: 20, requestedBy: "DeptStaff1", department: "ICU", availableQty: 15 },
    { id: 2, name: "Syringes", requestedQty: 10, requestedBy: "DeptStaff2", department: "Pharmacy", availableQty: 300 },
    { id: 3, name: "Face Masks", requestedQty: 5, requestedBy: "DeptStaff3", department: "ICU", availableQty: 200 },
  ]);

  const [equipmentList, setEquipmentList] = useState([
    { id: 1, name: "ECG Machine", department: "Cardiology" },
    { id: 2, name: "Infusion Pump", department: "ICU" },
  ]);

  const [history, setHistory] = useState([]);

  const [showPending, setShowPending] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  // ===== Auto-add equipment allocations on page load =====
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const equipmentAllocations = equipmentList.map((eq) => ({
      id: Date.now() + Math.random(),
      type: "Equipment",
      name: eq.name,
      department: eq.department,
      quantity: 1,
      allocatedBy: pharmacyUserId,
      date: today,
    }));
    setHistory(equipmentAllocations);
  }, []);

  // ===== Alerts auto-disappear =====
  useEffect(() => {
    if (alert.message) {
      const timer = setTimeout(() => setAlert({ type: "", message: "" }), 2000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // ===== Handlers =====
  const togglePending = () => setShowPending((prev) => !prev);

  const handleApprove = (reqId) => {
    const request = pendingRequests.find((r) => r.id === reqId);
    if (!request) return;

    if (request.requestedQty > request.availableQty) {
      setAlert({ type: "error", message: "Insufficient stock!" });
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    // Add to history
    setHistory((prev) => [
      {
        id: Date.now() + Math.random(),
        type: "Stock",
        name: request.name,
        department: request.department,
        quantity: request.requestedQty,
        allocatedBy: pharmacyUserId,
        date: today,
      },
      ...prev,
    ]);

    // Decrease available stock
    setPendingRequests((prev) =>
      prev.map((r) =>
        r.id === reqId
          ? { ...r, availableQty: r.availableQty - request.requestedQty }
          : r
      )
    );

    setAlert({ type: "success", message: "Stock allocation approved!" });
  };

  const handleReject = (reqId) => {
    setPendingRequests((prev) => prev.filter((r) => r.id !== reqId));
    setAlert({ type: "error", message: "Stock allocation rejected!" });
  };

  return (
    <div className="allocation-page">
      <h2>Allocation Management</h2>

      {alert.message && (
        <div className={`alert ${alert.type}`}>{alert.message}</div>
      )}

      <button className="allocate-toggle-btn" onClick={togglePending}>
        {showPending ? "Hide Pending Requests" : "+ Pending Requests"}
      </button>

      {/* Pending Requests Table */}
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
                  <td>{req.name}</td>
                  <td>{req.requestedQty}</td>
                  <td>{req.requestedBy}</td>
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

      {/* History Table */}
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
                <td>{h.allocatedBy}</td>
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


// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AllocationPage = ({ pharmacyUserId = "Pharmacy01" }) => {
//   const [pendingRequests, setPendingRequests] = useState([]);
//   const [history, setHistory] = useState([]);
//   const [showPending, setShowPending] = useState(false);
//   const [alert, setAlert] = useState({ type: "", message: "" });

//   // ===== Fetch pending stock requests from backend =====
//   const fetchPendingRequests = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(
//         "http://localhost:5000/api/stock-requests?status=pending",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setPendingRequests(res.data);
//     } catch (err) {
//       console.error("Failed to fetch pending requests:", err.message);
//       setAlert({ type: "error", message: "Failed to fetch pending requests!" });
//     }
//   };

//   // ===== Fetch allocation history =====
//   const fetchAllocationHistory = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.get(
//         "http://localhost:5000/api/allocations",
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setHistory(res.data);
//     } catch (err) {
//       console.error("Failed to fetch allocation history:", err.message);
//       setAlert({ type: "error", message: "Failed to fetch allocation history!" });
//     }
//   };

//   useEffect(() => {
//     fetchPendingRequests();
//     fetchAllocationHistory();
//   }, []);

//   // ===== Alerts auto-disappear =====
//   useEffect(() => {
//     if (alert.message) {
//       const timer = setTimeout(() => setAlert({ type: "", message: "" }), 2500);
//       return () => clearTimeout(timer);
//     }
//   }, [alert]);

//   // ===== Handlers =====
//   const togglePending = () => setShowPending((prev) => !prev);

//   const handleApprove = async (reqId) => {
//     try {
//       const token = localStorage.getItem("token");
//       const res = await axios.put(
//         `http://localhost:5000/api/stock-requests/${reqId}/approve`,
//         { allocatedBy: pharmacyUserId },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       // Update tables locally
//       setHistory((prev) => [res.data, ...prev]);
//       setPendingRequests((prev) => prev.filter((r) => r._id !== reqId));
//       setAlert({ type: "success", message: "Stock allocation approved!" });
//     } catch (err) {
//       console.error("Failed to approve request:", err.message);
//       setAlert({ type: "error", message: "Failed to approve request!" });
//     }
//   };

//   const handleReject = async (reqId) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.put(
//         `http://localhost:5000/api/stock-requests/${reqId}/reject`,
//         {},
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setPendingRequests((prev) => prev.filter((r) => r._id !== reqId));
//       setAlert({ type: "error", message: "Stock allocation rejected!" });
//     } catch (err) {
//       console.error("Failed to reject request:", err.message);
//       setAlert({ type: "error", message: "Failed to reject request!" });
//     }
//   };

//   const getBadgeStyle = (status) => {
//     switch (status) {
//       case "pending":
//         return { backgroundColor: "#ffc107", color: "#000" };
//       case "approved":
//         return { backgroundColor: "#28a745", color: "#fff" };
//       case "rejected":
//         return { backgroundColor: "#dc3545", color: "#fff" };
//       default:
//         return { backgroundColor: "#6c757d", color: "#fff" };
//     }
//   };

//   return (
//     <div className="allocation-page" style={{ padding: "20px" }}>
//       <h2>Allocation Management</h2>

//       {alert.message && <div className={`alert ${alert.type}`}>{alert.message}</div>}

//       <button onClick={togglePending} style={{ margin: "10px 0" }}>
//         {showPending ? "Hide Pending Requests" : "+ Pending Requests"}
//       </button>

//       {/* Pending Requests Table */}
//       {showPending && (
//         <div style={{ overflowX: "auto", marginBottom: "30px" }}>
//           <h3>Pending Requests</h3>
//           <table style={{ width: "100%", minWidth: "900px", borderCollapse: "collapse" }}>
//             <thead style={{ background: "#f8f9fa" }}>
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
//                 <tr key={req._id} style={{ borderBottom: "1px solid #eee" }}>
//                   <td>{req.item?.name || req.item}</td>
//                   <td>{req.quantity}</td>
//                   <td>{req.requestedBy?.name || req.requestedBy}</td>
//                   <td>{req.department}</td>
//                   <td>{req.availableQty || req.quantity}</td>
//                   <td>
//                     <button
//                       disabled={(req.availableQty || req.quantity) < req.quantity}
//                       onClick={() => handleApprove(req._id)}
//                     >
//                       Approve
//                     </button>
//                     <button onClick={() => handleReject(req._id)}>Reject</button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Allocation History Table */}
//       <div style={{ overflowX: "auto" }}>
//         <h3>Allocation Records</h3>
//         <table style={{ width: "100%", minWidth: "900px", borderCollapse: "collapse" }}>
//           <thead style={{ background: "#f8f9fa" }}>
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
//               <tr key={h._id || h.id} style={{ borderBottom: "1px solid #eee" }}>
//                 <td>{h.type}</td>
//                 <td>{h.name}</td>
//                 <td>{h.department}</td>
//                 <td>{h.quantity}</td>
//                 <td>{h.allocatedBy}</td>
//                 <td>{new Date(h.date).toLocaleDateString()}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AllocationPage;