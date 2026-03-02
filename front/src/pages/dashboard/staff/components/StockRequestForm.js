
import React, { useState, useEffect } from "react";
import axios from "axios";

const StockRequestForm = () => {
  const [formData, setFormData] = useState({
    item: "",
    quantity: "",
    department: ""
  });

  const [requests, setRequests] = useState([]);
  // 🔥 NEW STATES
const [stockItems, setStockItems] = useState([]);
const [departments, setDepartments] = useState([]);

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

  // ===== Fetch stock items for suggestions =====
const fetchStockItems = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/stock");
    
    setStockItems(res.data);

    // Extract unique departments from stock
    const uniqueDepartments = [
      ...new Set(res.data.map(item => item.department).filter(Boolean))
    ];
    setDepartments(uniqueDepartments);

  } catch (err) {
    console.error("Failed to fetch stock items:", err.message);
  }
};

  useEffect(() => {
    fetchRequests();
    fetchStockItems();
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

       // 🔒 Validate item exists in stock
  const itemExists = stockItems.some(
    (stock) => stock.name.toLowerCase() === formData.item.toLowerCase()
  );

  if (!itemExists) {
    alert("This item is not registered in stock!");
    return; // ⛔ STOP submission
  }


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
              {/* <select
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
              </select> */}

              <input
  type="text"
  name="item"
  list="stockItems"
  value={formData.item}
  onChange={handleChange}
  placeholder="Type or select item"
  required
  style={{ width: "100%", padding: "8px" }}
/>

<datalist id="stockItems">
  {stockItems.map((item) => (
    <option key={item._id} value={item.name} />
  ))}
</datalist>
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
              {/* <select
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
              </select> */}
           <input
  type="text"
  name="department"
  list="departmentList"
  value={formData.department}
  onChange={handleChange}
  placeholder="Type or select department"
  required
  style={{ width: "100%", padding: "8px" }}
/>

<datalist id="departmentList">
  {departments.map((dept, index) => (
    <option key={index} value={dept} />
  ))}
</datalist>

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
                  <td>  {req.createdAt
              ? new Date(req.createdAt).toLocaleDateString()
                 : "N/A"}</td>
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