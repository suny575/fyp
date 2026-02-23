import React, { useState } from "react";
import "../styles/StockManagement.css";

import { useLocation } from "react-router-dom";
import { useEffect, useRef } from "react";

const StockManagement = () => {
  // ================= STATE =================
  const [stockList, setStockList] = useState([
    {
      id: 1,
      name: "Paracetamol",
      batch: "B123",
      category: "Consumable",
      quantity: 50,
      expiry: "2026-04-12",
    },
    {
      id: 2,                        
      name: "Syringe 5ml",              
      batch: "SP-456",
      category: "Spare Part",
      quantity: 30,
      expiry: "",
    },
    {
      id: 3,
      name: "Syringe",
      batch: "AC-789",
      category: "Accessory",
      quantity: 100,
      expiry: "",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    batch: "",
    category: "",
    quantity: "",
    expiry: "",
  });

  // ================= HIGHLIGHT SUPPORT =================
const location = useLocation();
const queryParams = new URLSearchParams(location.search);
const highlightName = queryParams.get("highlight");

const rowRefs = useRef({});

useEffect(() => {
  if (highlightName && rowRefs.current[highlightName]) {
    rowRefs.current[highlightName].scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}, [highlightName]);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    setIsEdit(false);
    setFormData({
      name: "",
      batch: "",
      category: "",
      quantity: "",
      expiry: "",
    });
    setShowForm(true);
  };

  const handleEditClick = (item) => {
    setIsEdit(true);
    setSelectedId(item.id);
    setFormData(item);
    setShowForm(true);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (isEdit) {
      setStockList(
        stockList.map((item) =>
          item.id === selectedId ? { ...formData, id: selectedId } : item
        )
      );
    } else {
      const newItem = { ...formData, id: Date.now() };
      setStockList([...stockList, newItem]);
    }

    setShowForm(false);
  };

  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setStockList(stockList.filter((item) => item.id !== selectedId));
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  // ================= FILTER =================
  const filteredList = stockList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "" || item.category === filterCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="stock-container">
      <h2>Stock Management</h2>
      <p className="sub-text">Register and track all consumables, spare parts, and accessories</p>

      {/* ACTION BAR */}
      <div className="action-bar">
        <button className="add-btn" onClick={handleAddClick}>
          + Add Stock
        </button>

        <input
          type="text"
          placeholder="Search by name, batch, category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Consumable">Consumable</option>
          <option value="Spare Part">Spare Part</option>
          <option value="Accessory">Accessory</option>
        </select>
      </div>

      {/* INLINE ADD/EDIT FORM */}
      {showForm && (
        <div className="form-container">
          <h3>{isEdit ? "Edit Stock" : "Add Stock"}</h3>
          <form onSubmit={handleSave}>
            <input
              type="text"
              name="name"
              placeholder="Stock Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="batch"
              placeholder="Batch Number"
              value={formData.batch}
              onChange={handleChange}
              required
            />
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Consumable">Consumable</option>
              <option value="Spare Part">Spare Part</option>
              <option value="Accessory">Accessory</option>
            </select>
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
            {formData.category === "Consumable" && (
              <input
                type="date"
                name="expiry"
                placeholder="Expiry Date"
                value={formData.expiry}
                onChange={handleChange}
                required
              />
            )}

            <div className="form-buttons">
              <button type="submit" className="save-btn">Save</button>
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* STOCK TABLE */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Batch Number</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Expiry Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((item) => (
              <tr 
              key={item.id}
               ref={(el) => (rowRefs.current[item.name] = el)}
              className={highlightName === item.name ? "highlight-row" : ""}
              >
                <td>{item.name}</td>
                <td>{item.batch}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.expiry || "N/A"}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(item)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDeleteClick(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Delete Stock</h3>
            <p>Are you sure you want to delete this stock item?</p>
            <div className="modal-buttons">
              <button className="delete-btn" onClick={confirmDelete}>Yes</button>
              <button className="cancel-btn" onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockManagement;