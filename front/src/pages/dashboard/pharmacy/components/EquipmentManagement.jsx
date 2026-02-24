
import React, { useState } from "react";
import "../styles/EquipmentManagement.css";

const EquipmentManagement = () => {
  const [equipmentList, setEquipmentList] = useState([
    { id: 1, name: "ECG Machine", model: "ECG-100", serial: "SN12345", purchaseDate: "2023-06-12", department: "Cardiology" },
    { id: 2, name: "Infusion Pump", model: "INF-300", serial: "SN67890", purchaseDate: "2023-05-30", department: "ICU" },
    { id: 3, name: "Syringe Pump", model: "SYR-200", serial: "SN54321", purchaseDate: "2023-04-20", department: "Pharmacy" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showForm, setShowForm] = useState(false); // <-- NEW STATE

  const [formData, setFormData] = useState({ name: "", model: "", serial: "", purchaseDate: "", department: "" });

  // ====== HANDLERS ======
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddClick = () => {
    setIsEdit(false);
    setFormData({ name: "", model: "", serial: "", purchaseDate: "", department: "" });
    setShowForm(true);
  };

  const handleEditClick = (item) => {
    setIsEdit(true);
    setSelectedId(item.id);
    setFormData(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (isEdit) {
      setEquipmentList(
        equipmentList.map((item) => (item.id === selectedId ? { ...formData, id: selectedId } : item))
      );
    } else {
      const newItem = { ...formData, id: Date.now() };
      setEquipmentList([...equipmentList, newItem]);
    }
    setShowForm(false);
    setIsEdit(false);
    setSelectedId(null);
    setFormData({ name: "", model: "", serial: "", purchaseDate: "", department: "" });
  };

  const openDeleteModal = (id) => setSelectedId(id) || setShowDeleteModal(true);
  const confirmDelete = () => { setEquipmentList(equipmentList.filter((item) => item.id !== selectedId)); setShowDeleteModal(false); };
  const cancelDelete = () => setShowDeleteModal(false);

  // ====== FILTERED LIST ======
  const filteredList = equipmentList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serial.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "" || item.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  return (
    <div className="equipment-container">
      <h2>Equipment Management</h2>
      <p className="sub-text">Register and manage all pharmacy equipment</p>

      {/* ================= ADD / EDIT BUTTON ================= */}
      <button className="add-btn" onClick={handleAddClick}>+ Add Equipment</button>

      {/* ================= ADD / EDIT FORM ================= */}
      {showForm && (
        <div className="form-section">
          <h3>{isEdit ? "Edit Equipment" : "Add New Equipment"}</h3>
          <form onSubmit={handleSave}>
            <input name="name" placeholder="Equipment Name" value={formData.name} onChange={handleChange} required />
            <input name="model" placeholder="Model" value={formData.model} onChange={handleChange} required />
            <input name="serial" placeholder="Serial Number" value={formData.serial} onChange={handleChange} required />
            <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required />
            <select name="department" value={formData.department} onChange={handleChange} required>
              <option value="">Select Department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="ICU">ICU</option>
              <option value="Pharmacy">Pharmacy</option>
            </select>
            <div className="form-buttons">
              <button type="submit" className="save-btn">{isEdit ? "Update Equipment" : "Add Equipment"}</button>
              <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* ================= ACTION BAR ================= */}
      <div className="action-bar">
        <input type="text" placeholder="Search by name, model, serial..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
          <option value="">All Departments</option>
          <option value="Cardiology">Cardiology</option>
          <option value="ICU">ICU</option>
          <option value="Pharmacy">Pharmacy</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Model</th><th>Serial</th><th>Purchase Date</th><th>Department</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td><td>{item.model}</td><td>{item.serial}</td><td>{item.purchaseDate}</td><td>{item.department}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(item)}>Edit</button>
                  <button className="delete-btn" onClick={() => openDeleteModal(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="confirm-modal">
            <h3>Delete Equipment</h3>
            <p>Are you sure you want to delete this equipment?</p>
            <div className="modal-buttons">
              <button className="delete-btn" onClick={confirmDelete}>Yes</button>
              <button onClick={cancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentManagement;