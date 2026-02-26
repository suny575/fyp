
// import React, { useState, useEffect } from "react";
// import "../styles/EquipmentManagement.css";
// import axios from "axios";

// const EquipmentManagement = () => {

//        const mockData = [
//     { id: 1, name: "ECG Machine", model: "ECG-100", serial: "SN12345", purchaseDate: "2023-06-12", department: "Cardiology" },
//     { id: 2, name: "Infusion Pump", model: "INF-300", serial: "SN67890", purchaseDate: "2023-05-30", department: "ICU" },
//     { id: 3, name: "Syringe Pump", model: "SYR-200", serial: "SN54321", purchaseDate: "2023-04-20", department: "Pharmacy" },
//   ];

//   const [equipmentList, setEquipmentList] = useState([]);
//   const [useMock, setUseMock] = useState(false);

//   // Fetch equipment from backend
//   useEffect(() => {
//     const fetchEquipment = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/equipment");
//         setEquipmentList(res.data);
//         setUseMock(false);
//       } catch (err) {
//         console.error("Backend failed, using mock data", err.message);
//         setEquipmentList(mockData);
//         setUseMock(true);
//       }
//     };
//     fetchEquipment();
//   }, []);



//   // const [equipmentList, setEquipmentList] = useState([
//   //   { id: 1, name: "ECG Machine", model: "ECG-100", serial: "SN12345", purchaseDate: "2023-06-12", department: "Cardiology" },
//   //   { id: 2, name: "Infusion Pump", model: "INF-300", serial: "SN67890", purchaseDate: "2023-05-30", department: "ICU" },
//   //   { id: 3, name: "Syringe Pump", model: "SYR-200", serial: "SN54321", purchaseDate: "2023-04-20", department: "Pharmacy" },
//   // ]);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDepartment, setFilterDepartment] = useState("");
//   const [isEdit, setIsEdit] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showForm, setShowForm] = useState(false); // <-- NEW STATE

//   const [formData, setFormData] = useState({ name: "", model: "", serial: "", purchaseDate: "", department: "" });

//   // ====== HANDLERS ======
//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleAddClick = () => {
//     setIsEdit(false);
//     setFormData({ name: "", model: "", serial: "", purchaseDate: "", department: "" });
//     setShowForm(true);
//   };

//   const handleEditClick = (item) => {
//     setIsEdit(true);
//     setSelectedId(item.id);
//     setFormData(item);
//     setShowForm(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleSave = (e) => {
//     e.preventDefault();
//     if (isEdit) {
//       setEquipmentList(
//         equipmentList.map((item) => (item.id === selectedId ? { ...formData, id: selectedId } : item))
//       );
//     } else {
//       const newItem = { ...formData, id: Date.now() };
//       setEquipmentList([...equipmentList, newItem]);
//     }
//     setShowForm(false);
//     setIsEdit(false);
//     setSelectedId(null);
//     setFormData({ name: "", model: "", serial: "", purchaseDate: "", department: "" });
//   };

//   const openDeleteModal = (id) => setSelectedId(id) || setShowDeleteModal(true);
//   const confirmDelete = () => { setEquipmentList(equipmentList.filter((item) => item.id !== selectedId)); setShowDeleteModal(false); };
//   const cancelDelete = () => setShowDeleteModal(false);

//   // ====== FILTERED LIST ======
//   const filteredList = equipmentList.filter((item) => {
//     const matchesSearch =
//       item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.serial.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesDepartment = filterDepartment === "" || item.department === filterDepartment;
//     return matchesSearch && matchesDepartment;
//   });

//   return (
//     <div className="equipment-container">

//          {useMock && <p style={{ color: "red" }}>⚠️ Using mock data. Backend is unavailable.</p>}

//       <h2>Equipment Management</h2>
//       <p className="sub-text">Register and manage all pharmacy equipment</p>

//       {/* ================= ADD / EDIT BUTTON ================= */}
//       <button className="add-btn" onClick={handleAddClick}>+ Add Equipment</button>

//       {/* ================= ADD / EDIT FORM ================= */}
//       {showForm && (
//         <div className="form-section">
//           <h3>{isEdit ? "Edit Equipment" : "Add New Equipment"}</h3>
//           <form onSubmit={handleSave}>
//             <input name="name" placeholder="Equipment Name" value={formData.name} onChange={handleChange} required />
//             <input name="model" placeholder="Model" value={formData.model} onChange={handleChange} required />
//             <input name="serial" placeholder="Serial Number" value={formData.serial} onChange={handleChange} required />
//             <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required />
//             <select name="department" value={formData.department} onChange={handleChange} required>
//               <option value="">Select Department</option>
//               <option value="Cardiology">Cardiology</option>
//               <option value="ICU">ICU</option>
//               <option value="Pharmacy">Pharmacy</option>
//             </select>
//             <div className="form-buttons">
//               <button type="submit" className="save-btn">{isEdit ? "Update Equipment" : "Add Equipment"}</button>
//               <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
//             </div>
//           </form>
//         </div>
//       )}

//       {/* ================= ACTION BAR ================= */}
//       <div className="action-bar">
//         <input type="text" placeholder="Search by name, model, serial..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//         <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
//           <option value="">All Departments</option>
//           <option value="Cardiology">Cardiology</option>
//           <option value="ICU">ICU</option>
//           <option value="Pharmacy">Pharmacy</option>
//         </select>
//       </div>

//       {/* ================= TABLE ================= */}
//       <div className="table-wrapper">
//         <table>
//           <thead>
//             <tr>
//               <th>Name</th><th>Model</th><th>Serial</th><th>Purchase Date</th><th>Department</th><th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredList.map((item) => (
//               <tr key={item.id}>
//                 <td>{item.name}</td><td>{item.model}</td><td>{item.serial}</td><td>{item.purchaseDate}</td><td>{item.department}</td>
//                 <td>
//                   <button className="edit-btn" onClick={() => handleEditClick(item)}>Edit</button>
//                   <button className="delete-btn" onClick={() => openDeleteModal(item.id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* ================= DELETE MODAL ================= */}
//       {showDeleteModal && (
//         <div className="modal-overlay">
//           <div className="confirm-modal">
//             <h3>Delete Equipment</h3>
//             <p>Are you sure you want to delete this equipment?</p>
//             <div className="modal-buttons">
//               <button className="delete-btn" onClick={confirmDelete}>Yes</button>
//               <button onClick={cancelDelete}>No</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EquipmentManagement;




// import React, { useState, useEffect } from "react";
// import "../styles/EquipmentManagement.css";
// import axios from "axios";

// const EquipmentManagement = () => {
//   const mockData = [
//     { id: 1, name: "ECG Machine", model: "ECG-100", serial: "SN12345", purchaseDate: "2023-06-12", department: "Cardiology" },
//     { id: 2, name: "Infusion Pump", model: "INF-300", serial: "SN67890", purchaseDate: "2023-05-30", department: "ICU" },
//     { id: 3, name: "Syringe Pump", model: "SYR-200", serial: "SN54321", purchaseDate: "2023-04-20", department: "Pharmacy" },
//   ];

//   const [equipmentList, setEquipmentList] = useState([]);
//   const [useMock, setUseMock] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterDepartment, setFilterDepartment] = useState("");
//   const [isEdit, setIsEdit] = useState(false);
//   const [selectedId, setSelectedId] = useState(null);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState({ name: "", model: "", serial: "", purchaseDate: "", department: "" });

//   const API = "http://localhost:5000/api/equipment";

//   // ===== FETCH EQUIPMENT =====
//   const fetchEquipment = async () => {
//     try {
//       const res = await axios.get(API);
//       setEquipmentList(res.data);
//       setUseMock(false);
//     } catch (err) {
//       console.error("Backend failed, using mock data", err.message);
//       setEquipmentList(mockData);
//       setUseMock(true);
//     }
//   };

//   useEffect(() => {
//     fetchEquipment();
//   }, []);

//   // ===== HANDLERS =====
//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleAddClick = () => {
//     setIsEdit(false);
//     setFormData({ name: "", model: "", serial: "", purchaseDate: "", department: "" });
//     setShowForm(true);
//   };

//   const handleEditClick = (item) => {
//     setIsEdit(true);
//     setSelectedId(item._id || item.id); // use _id from backend
//     setFormData(item);
//     setShowForm(true);
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();


//      const token = localStorage.getItem("token");        // ⬅️ your JWT token
//   const userId = localStorage.getItem("userId");      // ⬅️ the logged-in user's ID or name

// if (!token) {
//   console.error("No token found. User must login!");
//   return;
// }

//     if (useMock) {
//       // fallback for mockData
//       if (isEdit) {
//         setEquipmentList(
//           equipmentList.map((item) => (item.id === selectedId ? { ...formData, id: selectedId } : item))
//         );
//       } else {
//         const newItem = { ...formData, id: Date.now() };
//         setEquipmentList([...equipmentList, newItem]);
//       }
//     } else {
//       try {
//         if (isEdit) {
//           await axios.put(`${API}/${selectedId}`, formData);
//         } else {
//           // await axios.post(API, formData);
          
//          // 👉 GET TOKEN
// const token = localStorage.getItem("token");

// // 👉 GET USER ID (or name depending what you saved at login)
// const userId = localStorage.getItem("userId");

// if (isEdit) {
//   await axios.put(
//     `${API}/${selectedId}`,
//     formData,
//     {
//       headers: {
//         // Authorization: `Bearer ${token}`
//                 Authorization: `Bearer ${token}`  // ⬅️ ADD THIS

//       }
//     }
//   );
// } else {
//   await axios.post(
//     API,
//     {
//       ...formData,
//       allocatedBy: userId   // ⬅️⬅️⬅️ ADD THIS
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${token}`   // ⬅️⬅️⬅️ ADD THIS
//       }
//     }
//   );
// }

//         }

    

//         fetchEquipment(); // refresh list from backend
//       } catch (err) {
//         console.error("Failed to save to backend:", err.message);
//       }
//     }

//     setShowForm(false);
//     setIsEdit(false);
//     setSelectedId(null);
//     setFormData({ name: "", model: "", serial: "", purchaseDate: "", department: "" });
//   };

//   const openDeleteModal = (id) => setSelectedId(id) || setShowDeleteModal(true);

//   const confirmDelete = async () => {
//     if (useMock) {
//       setEquipmentList(equipmentList.filter((item) => item.id !== selectedId));
//     } else {
//       try {
//         await axios.delete(`${API}/${selectedId}`);
//         fetchEquipment(); // refresh list
//       } catch (err) {
//         console.error("Failed to delete from backend:", err.message);
//       }
//     }
//     setShowDeleteModal(false);
//   };

//   const cancelDelete = () => setShowDeleteModal(false);

//   // ===== FILTERED LIST =====
//   const filteredList = equipmentList.filter((item) => {
//     const matchesSearch =
//       item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.serial.toLowerCase().includes(searchTerm.toLowerCase());
//     const matchesDepartment = filterDepartment === "" || item.department === filterDepartment;
//     return matchesSearch && matchesDepartment;
//   });

//   // ===== RENDER =====
//   return (
//     <div className="equipment-container">
//       {useMock && <p style={{ color: "red" }}>⚠️ Using mock data. Backend is unavailable.</p>}

//       <h2>Equipment Management</h2>
//       <p className="sub-text">Register and manage all pharmacy equipment</p>

//       <button className="add-btn" onClick={handleAddClick}>+ Add Equipment</button>

//       {showForm && (
//         <div className="form-section">
//           <h3>{isEdit ? "Edit Equipment" : "Add New Equipment"}</h3>
//           <form onSubmit={handleSave}>
//             <input name="name" placeholder="Equipment Name" value={formData.name} onChange={handleChange} required />
//             <input name="model" placeholder="Model" value={formData.model} onChange={handleChange} required />
//             <input name="serial" placeholder="Serial Number" value={formData.serial} onChange={handleChange} required />
//             <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required />
//             <select name="department" value={formData.department} onChange={handleChange} required>
//               <option value="">Select Department</option>
//               <option value="Cardiology">Cardiology</option>
//               <option value="ICU">ICU</option>
//               <option value="Pharmacy">Pharmacy</option>
//             </select>
//             <div className="form-buttons">
//               <button type="submit" className="save-btn">{isEdit ? "Update Equipment" : "Add Equipment"}</button>
//               <button type="button" className="cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
//             </div>
//           </form>
//         </div>
//       )}

//       <div className="action-bar">
//         <input type="text" placeholder="Search by name, model, serial..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
//         <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
//           <option value="">All Departments</option>
//           <option value="Cardiology">Cardiology</option>
//           <option value="ICU">ICU</option>
//           <option value="Pharmacy">Pharmacy</option>
//         </select>
//       </div>

//       <div className="table-wrapper">
//         <table>
//           <thead>
//             <tr>
//               <th>Name</th><th>Model</th><th>Serial</th><th>Purchase Date</th><th>Department</th><th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredList.map((item) => (
//               <tr key={item._id || item.id}>
//                 <td>{item.name}</td><td>{item.model}</td><td>{item.serial}</td><td>{item.purchaseDate?.slice(0,10)}</td><td>{item.department}</td>
//                 <td>
//                   <button className="edit-btn" onClick={() => handleEditClick(item)}>Edit</button>
//                   <button className="delete-btn" onClick={() => openDeleteModal(item._id || item.id)}>Delete</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {showDeleteModal && (
//         <div className="modal-overlay">
//           <div className="confirm-modal">
//             <h3>Delete Equipment</h3>
//             <p>Are you sure you want to delete this equipment?</p>
//             <div className="modal-buttons">
//               <button className="delete-btn" onClick={confirmDelete}>Yes</button>
//               <button onClick={cancelDelete}>No</button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default EquipmentManagement;
import React, { useState, useEffect } from "react";
import "../styles/EquipmentManagement.css";
import axios from "axios";

const EquipmentManagement = () => {
  // 🔹 Mock data fallback
  const mockData = [
    { id: 1, name: "ECG Machine", model: "ECG-100", serial: "SN12345", purchaseDate: "2023-06-12", department: "Cardiology" },
    { id: 2, name: "Infusion Pump", model: "INF-300", serial: "SN67890", purchaseDate: "2023-05-30", department: "ICU" },
    { id: 3, name: "Syringe Pump", model: "SYR-200", serial: "SN54321", purchaseDate: "2023-04-20", department: "Pharmacy" },
  ];

  const [equipmentList, setEquipmentList] = useState([]);
  const [useMock, setUseMock] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", model: "", serial: "", purchaseDate: "", department: "" });

  const API = "http://localhost:5000/api/equipment";

  // 🔹 Get token from localStorage
  const token = localStorage.getItem("token"); // ⬅️ ADD THIS
  if (!token) console.warn("No token found. Please login!"); // just a reminder

  // ===== FETCH EQUIPMENT =====
  const fetchEquipment = async () => {
    try {
      // 🔹 Add Authorization header for protected route
      const res = await axios.get(API, { headers: { Authorization: `Bearer ${token}` } }); // ⬅️ FIXED
      setEquipmentList(res.data);
      setUseMock(false);
    } catch (err) {
      console.error("Backend failed, using mock data:", err.response?.data || err.message);
      setEquipmentList(mockData);
      setUseMock(true);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  // ===== HANDLERS =====
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAddClick = () => {
    setIsEdit(false);
    setFormData({ name: "", model: "", serial: "", purchaseDate: "", department: "" });
    setShowForm(true);
  };

  const handleEditClick = (item) => {
    setIsEdit(true);
    setSelectedId(item._id || item.id); // use backend _id
    setFormData(item);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ===== SAVE EQUIPMENT =====
  const handleSave = async (e) => {
    e.preventDefault();

    if (!token) {
      alert("You must login to perform this action!");
      return;
    }

    try {
      if (useMock) {
        // 🔹 Fallback for mock data
        if (isEdit) {
          setEquipmentList(
            equipmentList.map((item) => (item.id === selectedId ? { ...formData, id: selectedId } : item))
          );
        } else {
          const newItem = { ...formData, id: Date.now() };
          setEquipmentList([...equipmentList, newItem]);
        }
      } else {
        if (isEdit) {
          // 🔹 PUT with Authorization header
          await axios.put(`${API}/${selectedId}`, formData, { headers: { Authorization: `Bearer ${token}` } }); // ⬅️ FIXED
        } else {
          // 🔹 POST with Authorization header
          await axios.post(API, formData, { headers: { Authorization: `Bearer ${token}` } }); // ⬅️ FIXED
        }
        fetchEquipment(); // refresh list from backend
      }
    } catch (err) {
      console.error("Failed to save equipment:", err.response?.data || err.message);
      alert("Failed to save equipment. Check console for details.");
    }

    // Reset form
    setShowForm(false);
    setIsEdit(false);
    setSelectedId(null);
    setFormData({ name: "", model: "", serial: "", purchaseDate: "", department: "" });
  };

  const openDeleteModal = (id) => setSelectedId(id) || setShowDeleteModal(true);

  const confirmDelete = async () => {
    if (useMock) {
      setEquipmentList(equipmentList.filter((item) => item.id !== selectedId));
    } else {
      try {
        await axios.delete(`${API}/${selectedId}`, { headers: { Authorization: `Bearer ${token}` } }); // ⬅️ FIXED
        fetchEquipment();
      } catch (err) {
        console.error("Failed to delete:", err.response?.data || err.message);
        alert("Failed to delete equipment. Check console for details.");
      }
    }
    setShowDeleteModal(false);
  };

  const cancelDelete = () => setShowDeleteModal(false);

  // ===== FILTERED LIST =====
  const filteredList = equipmentList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serial.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = filterDepartment === "" || item.department === filterDepartment;
    return matchesSearch && matchesDepartment;
  });

  // ===== RENDER =====
  return (
    <div className="equipment-container">
      {useMock && <p style={{ color: "red" }}>⚠️ Using mock data. Backend is unavailable.</p>}

      <h2>Equipment Management</h2>
      <p className="sub-text">Register and manage all pharmacy equipment</p>

      <button className="add-btn" onClick={handleAddClick}>+ Add Equipment</button>

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

      <div className="action-bar">
        <input type="text" placeholder="Search by name, model, serial..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
          <option value="">All Departments</option>
          <option value="Cardiology">Cardiology</option>
          <option value="ICU">ICU</option>
          <option value="Pharmacy">Pharmacy</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Model</th><th>Serial</th><th>Purchase Date</th><th>Department</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((item) => (
              <tr key={item._id || item.id}>
                <td>{item.name}</td>
                <td>{item.model}</td>
                <td>{item.serial}</td>
                <td>{item.purchaseDate?.slice(0,10)}</td>
                <td>{item.department}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEditClick(item)}>Edit</button>
                  <button className="delete-btn" onClick={() => openDeleteModal(item._id || item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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