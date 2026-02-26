// import React, { useState } from "react";

// const StockRequestForm = () => {
//   const [formData, setFormData] = useState({
//     item: "",
//     quantity: "",
//     reason: "",
//   });

//   const [requests, setRequests] = useState([
//     {
//       id: 1,
//       item: "Syringes",
//       quantity: 50,
//       status: "pending",
//       date: "2026-02-14",
//     },
//     {
//       id: 2,
//       item: "Face Masks",
//       quantity: 100,
//       status: "delivered",
//       date: "2026-02-10",
//     },
//   ]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const newRequest = {
//       id: requests.length + 1,
//       ...formData,
//       status: "pending",
//       date: new Date().toISOString().split("T")[0],
//     };

//     setRequests([newRequest, ...requests]);
//     setFormData({ item: "", quantity: "", reason: "" });
//   };

//   const getBadge = (status) => {
//     switch (status) {
//       case "pending":
//         return "bg-warning text-dark";
//       case "delivered":
//         return "bg-success";
//       case "rejected":
//         return "bg-danger";
//       default:
//         return "bg-secondary";
//     }
//   };

//   return (
//     <div>
//       <h3 className="fw-bold mb-4">Request Stock Materials</h3>

//       {/* Request Form */}
//       <div className="card shadow-sm mb-4">
//         <div className="card-body">
//           <form onSubmit={handleSubmit}>
//             <div className="row g-3">
//               <div className="col-md-4">
//                 <label className="form-label fw-semibold">Item</label>
//                 <select
//                   name="item"
//                   className="form-control"
//                   value={formData.item}
//                   onChange={handleChange}
//                   required
//                 >
//                   <option value="">Select item</option>
//                   <option value="Syringes">Syringes</option>
//                   <option value="Face Masks">Face Masks</option>
//                   <option value="Gloves">Gloves</option>
//                 </select>
//               </div>

//               <div className="col-md-3">
//                 <label className="form-label fw-semibold">Quantity</label>
//                 <input
//                   type="number"
//                   name="quantity"
//                   className="form-control"
//                   value={formData.quantity}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>

//               <div className="col-md-5">
//                 <label className="form-label fw-semibold">Reason</label>
//                 <input
//                   type="text"
//                   name="reason"
//                   className="form-control"
//                   value={formData.reason}
//                   onChange={handleChange}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="text-end mt-3">
//               <button type="submit" className="btn btn-primary px-4">
//                 Submit Request
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Request Tracking Table */}
//       <div className="card shadow-sm">
//         <div className="card-header bg-white fw-bold">Request History</div>

//         <div className="card-body p-0">
//           <table className="table mb-0">
//             <thead className="table-light">
//               <tr>
//                 <th>Item</th>
//                 <th>Quantity</th>
//                 <th>Status</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {requests.map((req) => (
//                 <tr key={req.id}>
//                   <td>{req.item}</td>
//                   <td>{req.quantity}</td>
//                   <td>
//                     <span className={`badge ${getBadge(req.status)}`}>
//                       {req.status}
//                     </span>
//                   </td>
//                   <td>{req.date}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StockRequestForm;


// import React, { useState } from "react";

// const StockRequestForm = () => {
//   const [formData, setFormData] = useState({
//     item: "",
//     quantity: "",
//     department: ""
//   });

//   const [requests, setRequests] = useState([
//     {
//       id: 1,
//       item: "Syringes",
//       quantity: 50,
//       department: "ICU",
//       requestedBy: "DeptStaff1",
//       status: "pending",
//       date: "2026-02-14"
//     }
//   ]);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const requestedBy = localStorage.getItem("username") || "DeptStaff";
//     const today = new Date().toISOString().split("T")[0];

//     const newRequest = {
//       id: Date.now(),
//       ...formData,
//       requestedBy,
//       status: "pending",
//       date: today
//     };

//     setRequests([newRequest, ...requests]);

//     setFormData({
//       item: "",
//       quantity: "",
//       department: ""
//     });
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
//     <div style={{ padding: "20px" }}>
//       <h3 style={{ fontWeight: "bold", marginBottom: "20px" }}>
//         Request Stock Materials
//       </h3>

//       {/* FORM */}
//       <div
//         style={{
//           background: "#fff",
//           padding: "20px",
//           borderRadius: "8px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//           marginBottom: "30px"
//         }}
//       >
//         <form onSubmit={handleSubmit}>
//           <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            
//             <div style={{ flex: "1 1 200px" }}>
//               <label>Item</label>
//               <select
//                 name="item"
//                 value={formData.item}
//                 onChange={handleChange}
//                 required
//                 style={{ width: "100%", padding: "8px" }}
//               >
//                 <option value="">Select item</option>
//                 <option value="Syringes">Syringes</option>
//                 <option value="Face Masks">Face Masks</option>
//                 <option value="Gloves">Gloves</option>
//               </select>
//             </div>

//             <div style={{ flex: "1 1 150px" }}>
//               <label>Quantity</label>
//               <input
//                 type="number"
//                 name="quantity"
//                 value={formData.quantity}
//                 onChange={handleChange}
//                 required
//                 style={{ width: "100%", padding: "8px" }}
//               />
//             </div>

//             <div style={{ flex: "1 1 200px" }}>
//               <label>Department</label>
//               <select
//                 name="department"
//                 value={formData.department}
//                 onChange={handleChange}
//                 required
//                 style={{ width: "100%", padding: "8px" }}
//               >
//                 <option value="">Select department</option>
//                 <option value="ICU">ICU</option>
//                 <option value="Cardiology">Cardiology</option>
//                 <option value="Pharmacy">Pharmacy</option>
//               </select>
//             </div>

      
//           </div>

//           <div style={{ textAlign: "right", marginTop: "20px" }}>
//             <button
//               type="submit"
//               style={{
//                 background: "#0d6efd",
//                 color: "#fff",
//                 padding: "8px 20px",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer"
//               }}
//             >
//               Submit Request
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* HISTORY TABLE */}
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: "8px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
//         }}
//       >
//         <div
//           style={{
//             padding: "15px",
//             borderBottom: "1px solid #eee",
//             fontWeight: "bold"
//           }}
//         >
//           Request History
//         </div>

//         <div style={{ overflowX: "auto" }}>
//           <table style={{ width: "100%", minWidth: "900px" }}>
//             <thead style={{ background: "#f8f9fa" }}>
//               <tr>
//                 <th style={{ padding: "10px" }}>Item</th>
//                 <th>Quantity</th>
//                 <th>Department</th>
//                 <th>Requested By</th>
//                 <th>Status</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {requests.map((req) => (
//                 <tr key={req.id} style={{ borderBottom: "1px solid #eee" }}>
//                   <td style={{ padding: "10px" }}>{req.item}</td>
//                   <td>{req.quantity}</td>
//                   <td>{req.department}</td>
//                   <td>{req.requestedBy}</td>
//                   <td>
//                     <span
//                       style={{
//                         ...getBadgeStyle(req.status),
//                         padding: "4px 10px",
//                         borderRadius: "12px",
//                         fontSize: "12px"
//                       }}
//                     >
//                       {req.status}
//                     </span>
//                   </td>
//                   <td>{req.date}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StockRequestForm;


// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const StockRequestForm = () => {
//   const [formData, setFormData] = useState({
//     item: "",
//     quantity: "",
//     department: ""
//   });

//   const [requests, setRequests] = useState([]);

//   // Fetch existing requests from backend on load
//   useEffect(() => {
//     const fetchRequests = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axios.get("http://localhost:5000/api/stock-requests", {
//           headers: { Authorization: `Bearer ${token}` }
//         });
//         setRequests(res.data.reverse()); // newest first
//       } catch (err) {
//         console.error("Failed to fetch requests:", err.message);
//       }
//     };
//     fetchRequests();
//   }, []);

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem("token");
//       const userId = localStorage.getItem("userId") || "DeptStaff";

//       const newRequest = {
//         item: formData.item,
//         quantity: formData.quantity,
//         department: formData.department,
//         requestedBy: userId,
//         status: "pending",
//         date: new Date()
//       };

//       const res = await axios.post(
//         "http://localhost:5000/api/stock-requests",
//         newRequest,
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       setRequests([res.data, ...requests]);
//       setFormData({ item: "", quantity: "", department: "" });
//     } catch (err) {
//       console.error("Failed to submit request:", err.message);
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
//     <div style={{ padding: "20px" }}>
//       <h3 style={{ fontWeight: "bold", marginBottom: "20px" }}>
//         Request Stock Materials
//       </h3>

//       {/* FORM */}
//       <div
//         style={{
//           background: "#fff",
//           padding: "20px",
//           borderRadius: "8px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
//           marginBottom: "30px"
//         }}
//       >
//         <form onSubmit={handleSubmit}>
//           <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
//             <div style={{ flex: "1 1 200px" }}>
//               <label>Item</label>
//               <select
//                 name="item"
//                 value={formData.item}
//                 onChange={handleChange}
//                 required
//                 style={{ width: "100%", padding: "8px" }}
//               >
//                 <option value="">Select item</option>
//                 <option value="Syringes">Syringes</option>
//                 <option value="Face Masks">Face Masks</option>
//                 <option value="Gloves">Gloves</option>
//               </select>
//             </div>

//             <div style={{ flex: "1 1 150px" }}>
//               <label>Quantity</label>
//               <input
//                 type="number"
//                 name="quantity"
//                 value={formData.quantity}
//                 onChange={handleChange}
//                 required
//                 style={{ width: "100%", padding: "8px" }}
//               />
//             </div>

//             <div style={{ flex: "1 1 200px" }}>
//               <label>Department</label>
//               <select
//                 name="department"
//                 value={formData.department}
//                 onChange={handleChange}
//                 required
//                 style={{ width: "100%", padding: "8px" }}
//               >
//                 <option value="">Select department</option>
//                 <option value="ICU">ICU</option>
//                 <option value="Cardiology">Cardiology</option>
//                 <option value="Pharmacy">Pharmacy</option>
//               </select>
//             </div>
//           </div>

//           <div style={{ textAlign: "right", marginTop: "20px" }}>
//             <button
//               type="submit"
//               style={{
//                 background: "#0d6efd",
//                 color: "#fff",
//                 padding: "8px 20px",
//                 border: "none",
//                 borderRadius: "5px",
//                 cursor: "pointer"
//               }}
//             >
//               Submit Request
//             </button>
//           </div>
//         </form>
//       </div>

//       {/* HISTORY TABLE */}
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: "8px",
//           boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
//         }}
//       >
//         <div
//           style={{
//             padding: "15px",
//             borderBottom: "1px solid #eee",
//             fontWeight: "bold"
//           }}
//         >
//           Request History
//         </div>

//         <div style={{ overflowX: "auto" }}>
//           <table style={{ width: "100%", minWidth: "900px" }}>
//             <thead style={{ background: "#f8f9fa" }}>
//               <tr>
//                 <th style={{ padding: "10px" }}>Item</th>
//                 <th>Quantity</th>
//                 <th>Department</th>
//                 <th>Requested By</th>
//                 <th>Status</th>
//                 <th>Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {requests.map((req) => (
//                 <tr key={req._id || req.id} style={{ borderBottom: "1px solid #eee" }}>
//                   <td style={{ padding: "10px" }}>{req.item}</td>
//                   <td>{req.quantity}</td>
//                   <td>{req.department}</td>
//                   <td>{req.requestedBy}</td>
//                   <td>
//                     <span
//                       style={{
//                         ...getBadgeStyle(req.status),
//                         padding: "4px 10px",
//                         borderRadius: "12px",
//                         fontSize: "12px"
//                       }}
//                     >
//                       {req.status}
//                     </span>
//                   </td>
//                   <td>{new Date(req.date).toLocaleDateString()}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StockRequestForm;


import React, { useState, useEffect } from "react";
import axios from "axios";

const StockRequestForm = () => {
  const [formData, setFormData] = useState({
    item: "",
    quantity: "",
    department: ""
  });

  const [requests, setRequests] = useState([]);

  // ===== Fetch requests from backend =====
  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/stock-requests", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(res.data);
    } catch (err) {
      console.error("Failed to fetch requests:", err.message);
      // fallback example (mock data)
      setRequests([
        {
          id: 1,
          item: "Syringes",
          quantity: 50,
          department: "ICU",
          requestedBy: "DeptStaff1",
          status: "pending",
          date: "2026-02-14"
        }
      ]);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const requestedBy = localStorage.getItem("username") || "DeptStaff";

    const newRequest = {
      ...formData,
      requestedBy,
      status: "pending",
      date: new Date().toISOString()
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/stock-requests",
        newRequest,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests([res.data, ...requests]);
      setFormData({ item: "", quantity: "", department: "" });
    } catch (err) {
      console.error("Failed to submit request:", err.message);
    }
  };

  const getBadgeStyle = (status) => {
    switch (status) {
      case "pending":
        return { backgroundColor: "#ffc107", color: "#000" };
      case "approved":
        return { backgroundColor: "#28a745", color: "#fff" };
      case "rejected":
        return { backgroundColor: "#dc3545", color: "#fff" };
      default:
        return { backgroundColor: "#6c757d", color: "#fff" };
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h3 style={{ fontWeight: "bold", marginBottom: "20px" }}>
        Request Stock Materials
      </h3>

      {/* FORM */}
      <div
        style={{
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          marginBottom: "30px"
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px" }}>
              <label>Item</label>
              <select
                name="item"
                value={formData.item}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px" }}
              >
                <option value="">Select item</option>
                <option value="Syringes">Syringes</option>
                <option value="Face Masks">Face Masks</option>
                <option value="Gloves">Gloves</option>
              </select>
            </div>

            <div style={{ flex: "1 1 150px" }}>
              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px" }}
              />
            </div>

            <div style={{ flex: "1 1 200px" }}>
              <label>Department</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
                style={{ width: "100%", padding: "8px" }}
              >
                <option value="">Select department</option>
                <option value="ICU">ICU</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pharmacy">Pharmacy</option>
              </select>
            </div>
          </div>

          <div style={{ textAlign: "right", marginTop: "20px" }}>
            <button
              type="submit"
              style={{
                background: "#0d6efd",
                color: "#fff",
                padding: "8px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>

      {/* HISTORY TABLE */}
      <div
        style={{
          background: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
        }}
      >
        <div
          style={{
            padding: "15px",
            borderBottom: "1px solid #eee",
            fontWeight: "bold"
          }}
        >
          Request History
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: "900px" }}>
            <thead style={{ background: "#f8f9fa" }}>
              <tr>
                <th style={{ padding: "10px" }}>Item</th>
                <th>Quantity</th>
                <th>Department</th>
                <th>Requested By</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req._id || req.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px" }}>{req.item?.name || req.item}</td>
                  <td>{req.quantity}</td>
                  <td>{req.department}</td>
                  <td>{req.requestedBy?.name || req.requestedBy}</td>
                  <td>
                    <span
                      style={{
                        ...getBadgeStyle(req.status),
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "12px"
                      }}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td>{new Date(req.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StockRequestForm;