

import React, { useState, useEffect } from "react";
import "../styles/Allocation.css";

const AllocationPage = ({ pharmacyUserId = "Pharmacy01" }) => {
  const [stockList, setStockList] = useState([
    { id: 1, name: "Gloves", available: 500 },
    { id: 2, name: "Syringes", available: 300 },
    { id: 3, name: "Face Masks", available: 200 },
  ]);

  const [equipmentList, setEquipmentList] = useState([
    { id: 1, name: "ECG Machine", department: "Cardiology" },
    { id: 2, name: "Infusion Pump", department: "ICU" },
  ]);

  const [allocations, setAllocations] = useState([]);

  const [formData, setFormData] = useState({
    stockId: "",
    department: "",
    quantity: "",
  });

  const [availableStock, setAvailableStock] = useState(0);
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAllocationId, setSelectedAllocationId] = useState(null);

  // NEW: show/hide stock allocation form
  const [showForm, setShowForm] = useState(false);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "stockId") {
      const stock = stockList.find((s) => s.id === parseInt(value));
      setAvailableStock(stock ? stock.available : 0);
    }
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
  };

  const handleAllocate = (e) => {
    e.preventDefault();
    const { stockId, department, quantity } = formData;

    if (!stockId || !department || !quantity) {
      setAlert({ type: "error", message: "Please fill all fields." });
      return;
    }

    if (parseInt(quantity) <= 0) {
      setAlert({ type: "error", message: "Quantity must be greater than 0." });
      return;
    }

    if (parseInt(quantity) > availableStock) {
      setAlert({ type: "error", message: "Insufficient stock available." });
      return;
    }

    const stockItem = stockList.find((s) => s.id === parseInt(stockId));
    const today = new Date().toISOString().split("T")[0];

    const newAllocation = {
      id: Date.now(),
      type: "Stock",
      name: stockItem.name,
      department,
      quantity: parseInt(quantity),
      allocatedBy: pharmacyUserId,
      date: today,
    };

    setAllocations((prev) => [newAllocation, ...prev]);

    // Update available stock
    setStockList((prev) =>
      prev.map((s) =>
        s.id === stockItem.id ? { ...s, available: s.available - quantity } : s
      )
    );

    setFormData({ stockId: "", department: "", quantity: "" });
    setAvailableStock(0);
    setAlert({ type: "success", message: "Stock allocated successfully!" });
    setShowForm(false); // hide form after allocation
  };

  const handleDeleteClick = (id) => {
    setSelectedAllocationId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    const allocation = allocations.find((a) => a.id === selectedAllocationId);
    if (allocation.type === "Stock") {
      setStockList((prev) =>
        prev.map((s) =>
          s.name === allocation.name
            ? { ...s, available: s.available + allocation.quantity }
            : s
        )
      );
    }
    setAllocations((prev) =>
      prev.filter((a) => a.id !== selectedAllocationId)
    );
    setShowDeleteModal(false);
    setAlert({ type: "success", message: "Allocation deleted successfully!" });
  };

  const cancelDelete = () => setShowDeleteModal(false);

  // AUTO-ADD equipment allocations (from equipment registration)
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

    setAllocations((prev) => [...equipmentAllocations, ...prev]);
  }, []);

  return (
    <div className="allocation-page">
      <h2>Allocation Management</h2>
      <p className="sub-text">Assign equipment and stock items to departments</p>

      {alert.message && (
        <div className={`alert ${alert.type}`}>{alert.message}</div>
      )}

      {/* NEW: Toggle Form Button */}
      <button className="allocate-toggle-btn" onClick={toggleForm}>
        {showForm ? "Hide Allocation Form" : "+ Allocate Stock"}
      </button>

      {/* STOCK ALLOCATION FORM */}
      {showForm && (
        <div className="allocation-form">
          <h3>Allocate Stock Item</h3>
          <form onSubmit={handleAllocate}>
            <div className="form-row">
              <label>Stock Item:</label>
              <select
                name="stockId"
                value={formData.stockId}
                onChange={handleChange}
              >
                <option value="">Select Stock</option>
                {stockList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <label>Department:</label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
              >
                <option value="">Select Department</option>
                <option value="ICU">ICU</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Pharmacy">Pharmacy</option>
              </select>
            </div>

            <div className="form-row">
              <label>Available Stock:</label>
              <input type="number" value={availableStock} disabled />
            </div>

            <div className="form-row">
              <label>Quantity to Assign:</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <label>Allocated By:</label>
              <input type="text" value={pharmacyUserId} disabled />
            </div>

            <div className="form-row">
              <label>Date:</label>
              <input
                type="text"
                value={new Date().toISOString().split("T")[0]}
                disabled
              />
            </div>

            <button type="submit" className="allocate-btn">
              Allocate
            </button>
          </form>
        </div>
      )}

{/* ALLOCATION RECORDS TABLE */}
<div className="allocation-table-wrapper">
  <h3>Allocation Records</h3>
  <div className="allocation-table-scroll">
    <table>
      <thead>
        <tr>
          <th>Type</th>
          <th>Name</th>
          <th>Department</th>
          <th>Quantity</th>
          <th>Allocated By</th>
          <th>Date</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {allocations.map((a) => (
          <tr key={a.id}>
            <td>{a.type}</td>
            <td>{a.name}</td>
            <td>{a.department}</td>
            <td>{a.quantity}</td>
            <td>{a.allocatedBy}</td>
            <td>{a.date}</td>
            <td>
              <button
                className="delete-btn"
                onClick={() => handleDeleteClick(a.id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>



      {/* DELETE CONFIRM MODAL */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Delete Allocation</h3>
            <p>Are you sure you want to delete this allocation?</p>
            <div className="modal-buttons">
              <button className="delete-btn" onClick={confirmDelete}>
                Yes
              </button>
              <button onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllocationPage;