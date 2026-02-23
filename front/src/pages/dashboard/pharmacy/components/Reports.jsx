// // // // PharmacyReports.jsx
// // // import React, { useState, useEffect } from "react";
// // // import {
// // //   BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend, ResponsiveContainer
// // // } from "recharts";
// // // import "../styles/Reports.css";

// // // // Dummy data
// // // const equipmentList = [
// // //   { id: 1, name: "ECG Machine", department: "Cardiology" },
// // //   { id: 2, name: "Infusion Pump", department: "ICU" },
// // //   { id: 3, name: "Syringe Pump", department: "Pharmacy" },
// // // ];

// // // const stockList = [
// // //   { id: 1, name: "Gloves", category: "Consumable", quantity: 50, expiry: "2026-02-25", department: "ICU", allocatedBy: "Pharmacy01", date: "2026-02-22" },
// // //   { id: 2, name: "IV Set", category: "Spare Part", quantity: 5, expiry: "", department: "ICU", allocatedBy: "Pharmacy01", date: "2026-02-20" },
// // //   { id: 3, name: "Syringe", category: "Accessory", quantity: 100, expiry: "", department: "Pharmacy", allocatedBy: "Pharmacy01", date: "2026-02-21" },
// // // ];

// // // const allocationRecords = [
// // //   { type: "Stock", name: "Gloves", department: "ICU", quantity: 100, allocatedBy: "Pharmacy01", date: "2026-02-22" },
// // //   { type: "Equipment", name: "ECG Machine", department: "Cardiology", quantity: 1, allocatedBy: "Pharmacy01", date: "2026-02-20" },
// // // ];

// // // // Pie chart colors
// // // const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

// // // const PharmacyReports = () => {
// // //   const [reportType, setReportType] = useState("Inventory");
// // //   const [chartData, setChartData] = useState([]);
// // //   const [filteredRecords, setFilteredRecords] = useState(allocationRecords);

// // //   // Generate chart data
// // //   useEffect(() => {
// // //     if (reportType === "Inventory") {
// // //       // Stock by Category
// // //       const data = [];
// // //       const categories = ["Consumable", "Spare Part", "Accessory"];
// // //       categories.forEach((cat) => {
// // //         const total = stockList
// // //           .filter((item) => item.category === cat)
// // //           .reduce((acc, item) => acc + item.quantity, 0);
// // //         data.push({ name: cat, value: total });
// // //       });
// // //       setChartData(data);
// // //     } else if (reportType === "Usage") {
// // //       // Equipment per department
// // //       const departments = [...new Set(equipmentList.map((e) => e.department))];
// // //       const data = departments.map((dep) => ({
// // //         department: dep,
// // //         quantity: equipmentList.filter((e) => e.department === dep).length,
// // //       }));
// // //       setChartData(data);
// // //     } else if (reportType === "Low Stock") {
// // //       const data = stockList.filter((s) => s.quantity < 20).map((s) => ({
// // //         name: s.name,
// // //         quantity: s.quantity,
// // //       }));
// // //       setChartData(data);
// // //     } else if (reportType === "Expiry") {
// // //       const today = new Date();
// // //       const expiring = stockList.filter((s) => s.expiry && new Date(s.expiry) <= today);
// // //       const safe = stockList.length - expiring.length;
// // //       setChartData([
// // //         { name: "Expiring", value: expiring.length },
// // //         { name: "Safe", value: safe },
// // //       ]);
// // //     }
// // //   }, [reportType]);

// // //   // Summary counts
// // //   const totalEquipment = equipmentList.length;
// // //   const totalStock = stockList.reduce((acc, s) => acc + s.quantity, 0);
// // //   const lowStockCount = stockList.filter((s) => s.quantity < 20).length;
// // //   const expiringCount = stockList.filter((s) => s.expiry && new Date(s.expiry) <= new Date()).length;

// // //   // Export simulation
// // //   const handleExport = (type) => {
// // //     alert(`Exporting ${type} report...`);
// // //   };

// // //   return (
// // //     <div className="reports-container">
// // //       <h2>Pharmacy Reports</h2>
// // //       <p className="sub-text">View inventory, usage, low stock, and expiry reports</p>

// // //       {/* Filters */}
// // //       <div className="filters">
// // //         <label>
// // //           Report Type:
// // //           <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
// // //             <option value="Inventory">Inventory</option>
// // //             <option value="Usage">Usage</option>
// // //             <option value="Low Stock">Low Stock</option>
// // //             <option value="Expiry">Expiry</option>
// // //           </select>
// // //         </label>

// // //         <button onClick={() => handleExport(reportType)} className="export-btn">
// // //           Export {reportType}
// // //         </button>
// // //       </div>

// // //       {/* Summary Cards */}
// // //       <div className="summary-cards">
// // //         <div className="card">Total Equipment: {totalEquipment}</div>
// // //         <div className="card">Total Stock: {totalStock}</div>
// // //         <div className="card">Low Stock Items: {lowStockCount}</div>
// // //         <div className="card">Expiring Items: {expiringCount}</div>
// // //       </div>

// // //       {/* Charts */}
// // //       <div className="charts">
// // //         {reportType === "Inventory" && (
// // //           <ResponsiveContainer width="100%" height={300}>
// // //             <PieChart>
// // //               <Pie
// // //                 data={chartData}
// // //                 dataKey="value"
// // //                 nameKey="name"
// // //                 cx="50%"
// // //                 cy="50%"
// // //                 outerRadius={100}
// // //                 fill="#8884d8"
// // //                 label
// // //               >
// // //                 {chartData.map((entry, index) => (
// // //                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// // //                 ))}
// // //               </Pie>
// // //               <Legend />
// // //               <Tooltip />
// // //             </PieChart>
// // //           </ResponsiveContainer>
// // //         )}
// // //         {reportType === "Usage" && (
// // //           <ResponsiveContainer width="100%" height={300}>
// // //             <BarChart data={chartData}>
// // //               <XAxis dataKey="department" />
// // //               <YAxis />
// // //               <Tooltip />
// // //               <Legend />
// // //               <Bar dataKey="quantity" fill="#82ca9d" />
// // //             </BarChart>
// // //           </ResponsiveContainer>
// // //         )}
// // //         {reportType === "Low Stock" && (
// // //           <ResponsiveContainer width="100%" height={300}>
// // //             <BarChart data={chartData}>
// // //               <XAxis dataKey="name" />
// // //               <YAxis />
// // //               <Tooltip />
// // //               <Bar dataKey="quantity" fill="#ff4d4f" />
// // //             </BarChart>
// // //           </ResponsiveContainer>
// // //         )}
// // //         {reportType === "Expiry" && (
// // //           <ResponsiveContainer width="100%" height={300}>
// // //             <PieChart>
// // //               <Pie
// // //                 data={chartData}
// // //                 dataKey="value"
// // //                 nameKey="name"
// // //                 cx="50%"
// // //                 cy="50%"
// // //                 outerRadius={100}
// // //                 fill="#ffbb28"
// // //                 label
// // //               >
// // //                 {chartData.map((entry, index) => (
// // //                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
// // //                 ))}
// // //               </Pie>
// // //               <Legend />
// // //               <Tooltip />
// // //             </PieChart>
// // //           </ResponsiveContainer>
// // //         )}
// // //       </div>

// // //       {/* Report Table */}
// // //       <div className="report-table">
// // //         <table>
// // //           <thead>
// // //             <tr>
// // //               <th>Type</th>
// // //               <th>Name</th>
// // //               <th>Category / Department</th>
// // //               <th>Quantity</th>
// // //               <th>Allocated By</th>
// // //               <th>Date</th>
// // //             </tr>
// // //           </thead>
// // //           <tbody>
// // //             {filteredRecords.map((rec, index) => (
// // //               <tr key={index}>
// // //                 <td>{rec.type}</td>
// // //                 <td>{rec.name}</td>
// // //                 <td>{rec.category || rec.department}</td>
// // //                 <td>{rec.quantity}</td>
// // //                 <td>{rec.allocatedBy}</td>
// // //                 <td>{rec.date}</td>
// // //               </tr>
// // //             ))}
// // //           </tbody>
// // //         </table>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default PharmacyReports;

// // PharmacyReports.jsx
// import React, { useState, useEffect } from "react";
// import "../styles/Reports.css";
// // import { equipmentList, stockList, allocationRecords } from "../data/mockData"; // replace with actual data source
// import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// const REPORT_TYPES = ["Inventory", "Usage", "Low Stock", "Expiry"];
// const CATEGORIES = ["All", "Consumable", "Spare Part", "Accessory"];
// const DEPARTMENTS = ["All", "Cardiology", "ICU", "Pharmacy"];

// const COLORS = ["#0ea5e9", "#f97316", "#16a34a", "#eab308", "#ef4444"];

// // ===== MOCK DATA =====
// const equipmentList = [
//   { id: 1, name: "ECG Machine", category: "Equipment", department: "Cardiology", purchaseDate: "2026-02-20" },
//   { id: 2, name: "Surgical Light", category: "Equipment", department: "Surgery", purchaseDate: "2026-01-15" },
//   { id: 3, name: "X-Ray Machine", category: "Equipment", department: "Radiology", purchaseDate: "2026-01-10" },
// ];

// const stockList = [
//   { id: 1, name: "Gloves", batch: "B123", category: "Consumable", quantity: 100, department: "ICU", expiry: "2026-02-22" },
//   { id: 2, name: "Syringe 5ml", batch: "SP-456", category: "Consumable", quantity: 200, department: "Pharmacy", expiry: "2026-04-01" },
//   { id: 3, name: "IV Set", batch: "AC-789", category: "Accessory", quantity: 30, department: "Surgery", expiry: "" },
// ];

// const allocationRecords = [
//   { type: "Equipment", name: "ECG Machine", department: "Cardiology", quantity: 1, allocatedBy: "Pharmacy01", date: "2026-02-20" },
//   { type: "Stock", name: "Gloves", department: "ICU", quantity: 100, allocatedBy: "Pharmacy01", date: "2026-02-22" },
//   { type: "Stock", name: "Syringe 5ml", department: "Pharmacy", quantity: 50, allocatedBy: "Pharmacy01", date: "2026-02-23" },
// ];



// const PharmacyReports = () => {
//   // ================== STATE ==================
//   const [reportType, setReportType] = useState("Inventory");
//   const [categoryFilter, setCategoryFilter] = useState("All");
//   const [departmentFilter, setDepartmentFilter] = useState("All");
//   const [dateFrom, setDateFrom] = useState("");
//   const [dateTo, setDateTo] = useState("");
//   const [filteredData, setFilteredData] = useState([]);
//   const [summary, setSummary] = useState({}); // summary cards

//   // ================== FILTER & GENERATE ==================
//   const generateReport = () => {
//     let data = [];
//     const from = dateFrom ? new Date(dateFrom) : null;
//     const to = dateTo ? new Date(dateTo) : null;

//     if (reportType === "Inventory") {
//       data = [
//         ...equipmentList.map(e => ({ type: "Equipment", ...e })),
//         ...stockList.map(s => ({ type: "Stock", ...s })),
//       ];
//     } else if (reportType === "Usage") {
//       data = allocationRecords;
//     } else if (reportType === "Low Stock") {
//       data = stockList.filter(s => s.quantity < 20).map(s => ({ type: "Stock", ...s }));
//     } else if (reportType === "Expiry") {
//       const today = new Date();
//       const next30 = new Date(today);
//       next30.setDate(today.getDate() + 30);
//       data = stockList.filter(s => s.expiry && new Date(s.expiry) <= next30).map(s => ({ type: "Stock", ...s }));
//     }

//     // Apply category filter
//     if (categoryFilter !== "All") {
//       data = data.filter(item => item.category === categoryFilter);
//     }

//     // Apply department filter
//     if (departmentFilter !== "All") {
//       data = data.filter(item => item.department === departmentFilter);
//     }

//     // Apply date filter (based on date property)
//     if (from || to) {
//       data = data.filter(item => {
//         const itemDate = new Date(item.date || item.purchaseDate || item.expiry || Date.now());
//         if (from && itemDate < from) return false;
//         if (to && itemDate > to) return false;
//         return true;
//       });
//     }

//     setFilteredData(data);

//     // ================== SUMMARY ==================
//     if (reportType === "Inventory") {
//       const totalEquipment = equipmentList.length;
//       const totalStock = stockList.reduce((acc, s) => acc + s.quantity, 0);
//       const totalCategories = new Set([...equipmentList.map(e => e.category), ...stockList.map(s => s.category)]).size;
//       const totalDepartments = new Set([...equipmentList.map(e => e.department), ...stockList.map(s => s.department)]).size;

//       setSummary({ totalEquipment, totalStock, totalCategories, totalDepartments });
//     } else if (reportType === "Low Stock") {
//       const totalLowItems = data.length;
//       const mostCritical = data.reduce((min, item) => (item.quantity < min.quantity ? item : min), data[0] || {});
//       const lowestQty = mostCritical.quantity || 0;
//       const affectedDepartments = new Set(data.map(d => d.department)).size;

//       setSummary({ totalLowItems, mostCriticalItem: mostCritical.name, lowestQty, affectedDepartments });
//     } else if (reportType === "Expiry") {
//       const totalExpiring = data.length;
//       const expiringSoon = data.map(d => d.name).join(", ");
//       setSummary({ totalExpiring, expiringSoon });
//     } else if (reportType === "Usage") {
//       const totalAllocations = data.length;
//       setSummary({ totalAllocations });
//     }
//   };

//   useEffect(() => {
//     generateReport();
//   }, [reportType, categoryFilter, departmentFilter, dateFrom, dateTo]);

//   // ================== EXPORT ==================
//   const handleExport = (type) => {
//     alert(`Simulate ${type} export for ${reportType} report`);
//   };

//   // ================== CHART DATA ==================
//   const pieData = [];
//   const barData = [];

//   if (reportType === "Inventory") {
//     const categoryCounts = {};
//     [...equipmentList, ...stockList].forEach(item => {
//       categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1;
//     });
//     Object.keys(categoryCounts).forEach(key => pieData.push({ name: key, value: categoryCounts[key] }));

//     const deptCounts = {};
//     [...equipmentList].forEach(e => {
//       deptCounts[e.department] = (deptCounts[e.department] || 0) + 1;
//     });
//     Object.keys(deptCounts).forEach(key => barData.push({ department: key, quantity: deptCounts[key] }));
//   }

//   if (reportType === "Low Stock") {
//     filteredData.forEach(item => barData.push({ name: item.name, quantity: item.quantity }));
//   }

//   if (reportType === "Expiry") {
//     pieData.push({ name: "Expiring", value: filteredData.length });
//     pieData.push({ name: "Safe", value: stockList.length - filteredData.length });
//   }

//   return (
//     <div className="reports-container">
//       <h2>Pharmacy Reports Dashboard</h2>
//       <p className="sub-text">Inventory • Usage • Low Stock • Expiry</p>

//       {/* ================== FILTER PANEL ================== */}
//       <div className="filters">
//         <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
//           {REPORT_TYPES.map(type => <option key={type}>{type}</option>)}
//         </select>

//         <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
//         <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />

//         <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
//           {CATEGORIES.map(c => <option key={c}>{c}</option>)}
//         </select>

//         <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
//           {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
//         </select>

//         <button className="generate-btn" onClick={generateReport}>Generate Report</button>
//         <button className="export-btn" onClick={() => handleExport("PDF")}>Export PDF</button>
//         <button className="export-btn" onClick={() => handleExport("Excel")}>Export Excel</button>
//       </div>

//       {/* ================== SUMMARY CARDS ================== */}
//       <div className="summary-cards">
//         {reportType === "Inventory" && (
//           <>
//             <div className="card">Total Equipment: {summary.totalEquipment}</div>
//             <div className="card">Total Stock: {summary.totalStock}</div>
//             <div className="card">Categories: {summary.totalCategories}</div>
//             <div className="card">Departments: {summary.totalDepartments}</div>
//           </>
//         )}
//         {reportType === "Low Stock" && (
//           <>
//             <div className="card">Total Low Items: {summary.totalLowItems}</div>
//             <div className="card">Most Critical Item: {summary.mostCriticalItem}</div>
//             <div className="card">Lowest Quantity: {summary.lowestQty}</div>
//             <div className="card">Affected Departments: {summary.affectedDepartments}</div>
//           </>
//         )}
//         {reportType === "Expiry" && (
//           <>
//             <div className="card">Total Expiring: {summary.totalExpiring}</div>
//             <div className="card">Expiring Soon: {summary.expiringSoon}</div>
//           </>
//         )}
//         {reportType === "Usage" && (
//           <div className="card">Total Allocations: {summary.totalAllocations}</div>
//         )}
//       </div>

//       {/* ================== CHARTS ================== */}
//       <div className="charts">
//         {pieData.length > 0 && (
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
//                 {pieData.map((entry, index) => (
//                   <Cell key={index} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         )}

//         {barData.length > 0 && (
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={barData}>
//               <XAxis dataKey={barData[0]?.department ? "department" : "name"} />
//               <YAxis />
//               <Tooltip />
//               <Bar dataKey="quantity" fill="#0ea5e9" />
//             </BarChart>
//           </ResponsiveContainer>
//         )}
//       </div>

//       {/* ================== TABLE ================== */}
//       <div className="report-table">
//         <table>
//           <thead>
//             <tr>
//               <th>Type</th>
//               <th>Name</th>
//               <th>Category</th>
//               <th>Department</th>
//               <th>Quantity</th>
//               <th>Allocated By</th>
//               <th>Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredData.map((item, index) => (
//               <tr key={index}>
//                 <td>{item.type}</td>
//                 <td>{item.name}</td>
//                 <td>{item.category || "-"}</td>
//                 <td>{item.department || "-"}</td>
//                 <td>{item.quantity || "-"}</td>
//                 <td>{item.allocatedBy || "-"}</td>
//                 <td>{item.date || item.purchaseDate || item.expiry || "-"}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default PharmacyReports;


import React, { useState, useEffect, useCallback } from "react";
import "../styles/Reports.css";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

// For PDF & Excel export
// import jsPDF from "jspdf";
// import "jspdf-autotable";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// ================= MOCK DATA =================
const equipmentList = [
  { id: 1, name: "ECG Machine", category: "Equipment", department: "Cardiology", quantity: 1, purchaseDate: "2026-02-20", allocatedBy: "Pharmacy01" },
  { id: 2, name: "X-Ray Machine", category: "Equipment", department: "Radiology", quantity: 1, purchaseDate: "2026-01-15", allocatedBy: "Pharmacy01" },
];

const stockList = [
  { id: 1, name: "Gloves", batch: "B123", category: "Consumable", quantity: 100, expiry: "2026-02-22", department: "ICU", allocatedBy: "Pharmacy01" },
  { id: 2, name: "Syringe 5ml", batch: "SP-456", category: "Consumable", quantity: 50, expiry: "2026-02-25", department: "Pharmacy", allocatedBy: "Pharmacy01" },
  { id: 3, name: "Stethoscope", batch: "AC-789", category: "Accessory", quantity: 10, expiry: "", department: "Cardiology", allocatedBy: "Pharmacy01" },
];

const allocationRecords = [
  { type: "Stock", name: "Gloves", category: "Consumable", department: "ICU", quantity: 100, allocatedBy: "Pharmacy01", date: "2026-02-22" },
  { type: "Equipment", name: "ECG Machine", category: "Equipment", department: "Cardiology", quantity: 1, allocatedBy: "Pharmacy01", date: "2026-02-20" },
];

// ================= CONSTANTS =================
const REPORT_TYPES = ["Inventory", "Usage", "Low Stock", "Expiry"];
const CATEGORIES = ["All", "Consumable", "Spare Part", "Accessory", "Equipment"];
const DEPARTMENTS = ["All", "Cardiology", "ICU", "Pharmacy"];
const COLORS = ["#0ea5e9", "#f97316", "#16a34a", "#eab308", "#ef4444"];

const PharmacyReports = () => {
  // ================== STATE ==================
  const [reportType, setReportType] = useState("Inventory");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [summary, setSummary] = useState({});

  // ================== GENERATE REPORT ==================
  const generateReport = useCallback(() => {
    let data = [];
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;

    if (reportType === "Inventory") {
      data = [
        ...equipmentList.map(e => ({ type: "Equipment", ...e })),
        ...stockList.map(s => ({ type: "Stock", ...s })),
      ];
    } else if (reportType === "Usage") {
      data = allocationRecords;
    } else if (reportType === "Low Stock") {
      data = stockList.filter(s => s.quantity < 20).map(s => ({ type: "Stock", ...s }));
    } else if (reportType === "Expiry") {
      const today = new Date();
      const next30 = new Date(today);
      next30.setDate(today.getDate() + 30);
      data = stockList.filter(s => s.expiry && new Date(s.expiry) <= next30).map(s => ({ type: "Stock", ...s }));
    }

    // Apply category filter
    if (categoryFilter !== "All") data = data.filter(item => item.category === categoryFilter);

    // Apply department filter
    if (departmentFilter !== "All") data = data.filter(item => item.department === departmentFilter);

    // Apply date filter
    if (from || to) {
      data = data.filter(item => {
        const itemDate = new Date(item.date || item.purchaseDate || item.expiry || Date.now());
        if (from && itemDate < from) return false;
        if (to && itemDate > to) return false;
        return true;
      });
    }

    setFilteredData(data);

    // ================== SUMMARY ==================
    if (reportType === "Inventory") {
      const totalEquipment = equipmentList.length;
      const totalStock = stockList.reduce((acc, s) => acc + s.quantity, 0);
      const totalCategories = new Set([...equipmentList.map(e => e.category), ...stockList.map(s => s.category)]).size;
      const totalDepartments = new Set([...equipmentList.map(e => e.department), ...stockList.map(s => s.department)]).size;
      setSummary({ totalEquipment, totalStock, totalCategories, totalDepartments });
    } else if (reportType === "Low Stock") {
      const totalLowItems = data.length;
      const mostCritical = data.reduce((min, item) => (item.quantity < min.quantity ? item : min), data[0] || {});
      const lowestQty = mostCritical.quantity || 0;
      const affectedDepartments = new Set(data.map(d => d.department)).size;
      setSummary({ totalLowItems, mostCriticalItem: mostCritical.name, lowestQty, affectedDepartments });
    } else if (reportType === "Expiry") {
      const totalExpiring = data.length;
      const expiringSoon = data.map(d => d.name).join(", ");
      setSummary({ totalExpiring, expiringSoon });
    } else if (reportType === "Usage") {
      const totalAllocations = data.length;
      setSummary({ totalAllocations });
    }
  }, [reportType, categoryFilter, departmentFilter, dateFrom, dateTo]);

  // ================== AUTO UPDATE ==================
  useEffect(() => {
    generateReport();
  }, [generateReport]);

  // ================== EXPORT ==================
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Pharmacy ${reportType} Report`, 10, 10);
    const tableColumn = ["Type", "Name", "Category", "Department", "Quantity", "Allocated By", "Date"];
    const tableRows = filteredData.map(item => [
      item.type, item.name, item.category || "-", item.department || "-", item.quantity || "-", item.allocatedBy || "-", item.date || item.purchaseDate || item.expiry || "-"
    ]);
    // doc.autoTable({ head: [tableColumn], body: tableRows, startY: 20 });
    autoTable(doc, {
  head: [tableColumn],
  body: tableRows,
  startY: 20
});
    doc.save(`${reportType}_Report.pdf`);
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData.map(item => ({
      Type: item.type,
      Name: item.name,
      Category: item.category || "-",
      Department: item.department || "-",
      Quantity: item.quantity || "-",
      AllocatedBy: item.allocatedBy || "-",
      Date: item.date || item.purchaseDate || item.expiry || "-"
    })));
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${reportType}_Report.xlsx`);
  };

  // ================== CHART DATA ==================
  const pieData = [];
  const barData = [];

  if (reportType === "Inventory") {
    const categoryCounts = {};
    [...equipmentList, ...stockList].forEach(item => categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1);
    Object.keys(categoryCounts).forEach(key => pieData.push({ name: key, value: categoryCounts[key] }));

    const deptCounts = {};
    [...equipmentList].forEach(e => deptCounts[e.department] = (deptCounts[e.department] || 0) + 1);
    Object.keys(deptCounts).forEach(key => barData.push({ department: key, quantity: deptCounts[key] }));
  } else if (reportType === "Low Stock") {
    filteredData.forEach(item => barData.push({ name: item.name, quantity: item.quantity }));
  } else if (reportType === "Expiry") {
    pieData.push({ name: "Expiring", value: filteredData.length });
    pieData.push({ name: "Safe", value: stockList.length - filteredData.length });
  }

  return (
    <div className="reports-container">
      <h2>Pharmacy Reports Dashboard</h2>
      <p className="sub-text">Inventory • Usage • Low Stock • Expiry</p>

      {/* FILTER PANEL */}
      <div className="filters">
        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          {REPORT_TYPES.map(type => <option key={type}>{type}</option>)}
        </select>

        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />

        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>

        <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)}>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>

        <button className="export-btn" onClick={exportPDF}>Export PDF</button>
        <button className="export-btn" onClick={exportExcel}>Export Excel</button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="summary-cards">
        {reportType === "Inventory" && (
          <>
            <div className="card">Total Equipment: {summary.totalEquipment}</div>
            <div className="card">Total Stock: {summary.totalStock}</div>
            <div className="card">Categories: {summary.totalCategories}</div>
            <div className="card">Departments: {summary.totalDepartments}</div>
          </>
        )}
        {reportType === "Low Stock" && (
          <>
            <div className="card">Total Low Items: {summary.totalLowItems}</div>
            <div className="card">Most Critical Item: {summary.mostCriticalItem}</div>
            <div className="card">Lowest Quantity: {summary.lowestQty}</div>
            <div className="card">Affected Departments: {summary.affectedDepartments}</div>
          </>
        )}
        {reportType === "Expiry" && (
          <>
            <div className="card">Total Expiring: {summary.totalExpiring}</div>
            <div className="card">Expiring Soon: {summary.expiringSoon}</div>
          </>
        )}
        {reportType === "Usage" && (
          <div className="card">Total Allocations: {summary.totalAllocations}</div>
        )}
      </div>

      {/* CHARTS */}
      <div className="charts">
        {pieData.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
        {barData.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <XAxis dataKey={barData[0]?.department ? "department" : "name"} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* TABLE */}
      <div className="report-table">
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Name</th>
              <th>Category</th>
              <th>Department</th>
              <th>Quantity</th>
              <th>Allocated By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>{item.type}</td>
                <td>{item.name}</td>
                <td>{item.category || "-"}</td>
                <td>{item.department || "-"}</td>
                <td>{item.quantity || "-"}</td>
                <td>{item.allocatedBy || "-"}</td>
                <td>{item.date || item.purchaseDate || item.expiry || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PharmacyReports;