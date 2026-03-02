


import React, { useState, useEffect, useRef } from "react";
import "../styles/StockManagement.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

const StockManagement = () => {

  // ================= MOCK DATA =================
  const mockData = [
    { _id: "1", name: "Paracetamol", batch: "B123", category: "Consumable", quantity: 50, expiry: "2026-04-12" },
    { _id: "2", name: "Syringe 5ml", batch: "SP-456", category: "Spare Part", quantity: 30, expiry: "" },
    { _id: "3", name: "Syringe", batch: "AC-789", category: "Accessory", quantity: 100, expiry: "" },
  ];

  const [stockList, setStockList] = useState([]);
  const [useMock, setUseMock] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  // const [filterCategory, setFilterCategory] = useState("");
  const [categories, setCategories] = useState([]);
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

  // ================= FETCH FROM BACKEND =================
  useEffect(() => {
    const fetchStock = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/stock");
        setStockList(res.data);
        // 👉 Extract unique categories from backend data
const uniqueCategories = [
  ...new Set(res.data.map(item => item.category).filter(Boolean))
];
setCategories(uniqueCategories);
        setUseMock(false);
      } catch (err) {
        console.error("Backend failed, using mock data", err.message);
        setStockList(mockData);
        setUseMock(true);
      }
    };
    fetchStock();
  }, []);

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
  }, [highlightName, stockList]);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddClick = () => {
    setIsEdit(false);
    setFormData({ name: "", batch: "", category: "", quantity: "", expiry: "" });
    setShowForm(true);
  };

  const handleEditClick = (item) => {
    setIsEdit(true);
    setSelectedId(item._id);
    setFormData(item);
    setShowForm(true);
  };

  // ================= SAVE =================
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      if (useMock) {
        // If backend failed → work locally
        if (isEdit) {
          setStockList(
            stockList.map((item) =>
              item._id === selectedId ? { ...formData, _id: selectedId } : item
            )
          );
        } else {
          const newItem = { ...formData, _id: Date.now().toString() };
          setStockList([...stockList, newItem]);
        }
      } else {
        if (isEdit) {
          const res = await axios.put(
            `http://localhost:5000/api/stock/${selectedId}`,
            formData
          );
          setStockList(
            stockList.map((item) =>
              item._id === selectedId ? res.data : item
            )
          );
        } else {
          const res = await axios.post(
            "http://localhost:5000/api/stock",
            formData
          );
          setStockList([...stockList, res.data]);
        }
      }

      setShowForm(false);
      setIsEdit(false);
      setSelectedId(null);
      setFormData({ name: "", batch: "", category: "", quantity: "", expiry: "" });

    } catch (err) {
      console.error("Save failed", err.message);
    }
  };

  // ================= DELETE =================
  const handleDeleteClick = (id) => {
    setSelectedId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (useMock) {
        setStockList(stockList.filter((item) => item._id !== selectedId));
      } else {
        await axios.delete(`http://localhost:5000/api/stock/${selectedId}`);
        setStockList(stockList.filter((item) => item._id !== selectedId));
      }
    } catch (err) {
      console.error("Delete failed", err.message);
    }
    setShowDeleteModal(false);
  };

  const cancelDelete = () => setShowDeleteModal(false);

  // ================= FILTER =================
       const filteredList = stockList.filter((item) => {
  return (
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );
});


  // const filteredList = stockList.filter((item) => {
  //   const matchesSearch =
  //     item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     item.category.toLowerCase().includes(searchTerm.toLowerCase());

  //   // const matchesCategory =
  //   //   filterCategory === "" || item.category === filterCategory;

  //   // return matchesSearch && matchesCategory;
  // });

  return (
    <div className="stock-container">

      {useMock && (
        <p style={{ color: "red" }}>
          ⚠️ Backend unavailable. Using mock data.
        </p>
      )}

      <h2>Stock Management</h2>
      <p className="sub-text">
        Register and track all consumables, spare parts, and accessories
      </p>

      {/* ACTION BAR */}
      <div className="action-bar">
        <button className="add-btn" onClick={handleAddClick}>
          + Add Stock
        </button>

        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="Consumable">Consumable</option>
          <option value="Spare Part">Spare Part</option>
          <option value="Accessory">Accessory</option>
        </select> */}
      </div>

      {/* FORM */}
      {showForm && (
        <div className="form-container">
          <h3>{isEdit ? "Edit Stock" : "Add Stock"}</h3>
          <form onSubmit={handleSave}>
            <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            <input name="batch" placeholder="Batch" value={formData.batch} onChange={handleChange} required />
            {/* <select name="category" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="Consumable">Consumable</option>
              <option value="Spare Part">Spare Part</option>
              <option value="Accessory">Accessory</option>
            </select> */}
            <input
  name="category"
  placeholder="Category"
  value={formData.category}
  onChange={handleChange}
  list="categoryList"
  required
/>

<datalist id="categoryList">
  {categories.map((cat, index) => (
    <option key={index} value={cat} />
  ))}
</datalist>

            <input type="number" name="quantity" placeholder="Quantity" value={formData.quantity} onChange={handleChange} required />
            {formData.category === "Consumable" && (
              <input type="date" name="expiry" value={formData.expiry} onChange={handleChange} required />
            )}
            <div className="form-buttons">
              <button type="submit" className="save-btn">Save</button>
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* TABLE */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Batch</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Expiry</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((item) => (
              <tr
                key={item._id}
                ref={(el) => (rowRefs.current[item.name] = el)}
                className={highlightName === item.name ? "highlight-row" : ""}
              >
                <td>{item.name}</td>
                <td>{item.batch}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>  {item.expiry
    ? new Date(item.expiry).toLocaleDateString("en-GB")
    : "N/A"}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(item)}>Edit</button>
                  <button className="delete-btn"  onClick={() => handleDeleteClick(item._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Delete Stock</h3>
            <p>Are you sure?</p>
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