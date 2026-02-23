// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import jsPDF from "jspdf";
// import autoTable from "jspdf-autotable";
// import "../styles/report.css";

// const Reports = () => {
//   /* ===========================
//      DATE RANGE (Default: Last 30 Days)
//   ============================ */
//   const today = new Date();
//   const pastMonth = new Date();
//   pastMonth.setMonth(today.getMonth() - 1);

//   const [startDate, setStartDate] = useState(pastMonth);
//   const [endDate, setEndDate] = useState(today);

//   /* ===========================
//      STATE
//   ============================ */
//   const [reports, setReports] = useState([]);
//   const [loading, setLoading] = useState(false);

//   /* ===========================
//      MOCK DATA (Fallback)
//   ============================ */
//   const mockReports = [
//     {
//       name: "John Doe",
//       role: "Technician",
//       action: "Updated Equipment",
//       date: "2026-02-10",
//     },
//     {
//       name: "Sara Smith",
//       role: "Dep-Staff",
//       action: "Requested Maintenance",
//       date: "2026-02-12",
//     },
//     {
//       name: "Pharma Admin",
//       role: "Pharmacy Store",
//       action: "Added Inventory",
//       date: "2026-02-15",
//     },
//   ];

//   /* ===========================
//      FETCH DATA
//   ============================ */
//   const fetchReports = async () => {
//     setLoading(true);

//     try {
//       const response = await axios.get(
//         `/api/reports?start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
//       );
//       setReports(response.data);
//     } catch (error) {
//       console.log("Backend not connected. Using mock data.");
//       setReports(mockReports);
//     }

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchReports();
//   }, [startDate, endDate]);

//   /* ===========================
//      FILTERED REPORTS
//   ============================ */
//   const filteredReports = reports.filter((report) => {
//     const reportDate = new Date(report.date);
//     return reportDate >= startDate && reportDate <= endDate;
//   });

//   /* ===========================
//      SUMMARY COUNTS
//   ============================ */
//   const technicianCount = filteredReports.filter(
//     (r) => r.role === "Technician",
//   ).length;

//   const depStaffCount = filteredReports.filter(
//     (r) => r.role === "Dep-Staff",
//   ).length;

//   const pharmacyCount = filteredReports.filter(
//     (r) => r.role === "Pharmacy Store",
//   ).length;

//   /* ===========================
//      EXPORT PDF
//   ============================ */
//   const exportPDF = () => {
//     const doc = new jsPDF();

//     doc.setFontSize(18);
//     doc.text("System Activity Report", 14, 20);

//     doc.setFontSize(10);
//     doc.text(
//       `From: ${startDate.toLocaleDateString()}  To: ${endDate.toLocaleDateString()}`,
//       14,
//       28,
//     );

//     const tableColumn = ["Name", "Role", "Action", "Date"];
//     const tableRows = [];

//     filteredReports.forEach((report) => {
//       tableRows.push([
//         report.name,
//         report.role,
//         report.action,
//         new Date(report.date).toLocaleDateString(),
//       ]);
//     });

//     autoTable(doc, {
//       head: [tableColumn],
//       body: tableRows,
//       startY: 35,
//       theme: "grid",
//       styles: { fontSize: 9 },
//       headStyles: { fillColor: [52, 73, 94] },
//     });

//     doc.save("System_Report.pdf");
//   };

//   return (
//     <div className="reports-container">
//       <h2 className="page-title">Manager Reports</h2>

//       {/* SUMMARY CARDS */}
//       <div className="summary-cards">
//         <div className="card">
//           <h4>Technician</h4>
//           <p>{technicianCount}</p>
//         </div>

//         <div className="card">
//           <h4>Dep-Staff</h4>
//           <p>{depStaffCount}</p>
//         </div>

//         <div className="card">
//           <h4>Pharmacy Store</h4>
//           <p>{pharmacyCount}</p>
//         </div>
//       </div>

//       {/* DATE FILTER */}
//       <div className="filters">
//         <div className="date-field">
//           <label>Start Date</label>
//           <DatePicker
//             selected={startDate}
//             onChange={(date) => setStartDate(date)}
//             className="date-input"
//           />
//         </div>

//         <div className="date-field">
//           <label>End Date</label>
//           <DatePicker
//             selected={endDate}
//             onChange={(date) => setEndDate(date)}
//             className="date-input"
//           />
//         </div>
//       </div>

//       {/* TABLE */}
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <table className="report-table">
//           <thead>
//             <tr>
//               <th>Name</th>
//               <th>Role</th>
//               <th>Action</th>
//               <th>Date</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredReports.length > 0 ? (
//               filteredReports.map((report, index) => (
//                 <tr key={index}>
//                   <td>{report.name}</td>
//                   <td>{report.role}</td>
//                   <td>{report.action}</td>
//                   <td>{new Date(report.date).toLocaleDateString()}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="4" className="no-data">
//                   No reports found for selected date range.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       )}

//       <div className="d-flex">
//         <button className="export-btn ms-auto " onClick={exportPDF}>
//           Export PDF
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Reports;

import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/report.css";

const Reports = () => {
  // DATE RANGE DEFAULT: LAST 30 DAYS
  const today = new Date();
  const pastMonth = new Date();
  pastMonth.setMonth(today.getMonth() - 1);

  const [startDate, setStartDate] = useState(pastMonth);
  const [endDate, setEndDate] = useState(today);

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // MOCK DATA
  const mockReports = [
    {
      name: "John Doe",
      role: "Technician",
      action: "Updated Equipment",
      date: "2026-02-10",
    },
    {
      name: "Sara Smith",
      role: "Dep-Staff",
      action: "Reuest Maintenance",
      date: "2026-02-12",
    },
    {
      name: "Pharma Store",
      role: "Pharmacy Store",
      action: "Added Inventory",
      date: "2026-02-15",
    },
    {
      name: "Alice Tech",
      role: "Technician",
      action: "Checked Device",
      date: "2026-01-15",
    },
    {
      name: "Bob Staff",
      role: "Dep-Staff",
      action: "Inventory Check",
      date: "2026-01-12",
    },

    {
      name: "New Tech",
      role: "Technician",
      action: "Task Assigned",
      date: "2026-02-18",
    },

    {
      name: "Pharma Admin",
      role: "Pharmacy Store",
      action: "Stock Updated",
      date: "2026-02-15",
    },
  ];

  // FETCH REPORTS
  const fetchReports = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/api/reports?start=${startDate.toISOString()}&end=${endDate.toISOString()}`,
      );
      setReports(response.data);
    } catch (err) {
      console.log("Backend not connected, using mock data.");
      setReports(mockReports);
      setError("Using mock data (backend not connected)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [startDate, endDate]);

  // FILTER REPORTS FOR SELECTED DATE RANGE
  const filteredReports = reports.filter((r) => {
    const d = new Date(r.date);
    return d >= startDate && d <= endDate;
  });

  // SUMMARY COUNTS
  const technicianCount = filteredReports.filter(
    (r) => r.role === "Technician",
  ).length;
  const depStaffCount = filteredReports.filter(
    (r) => r.role === "Dep-Staff",
  ).length;
  const pharmacyCount = filteredReports.filter(
    (r) => r.role === "Pharmacy Store",
  ).length;

  // TOTAL ACTIVITY GROWTH
  const calculateGrowth = () => {
    const periodLength = endDate.getTime() - startDate.getTime();

    const prevStart = new Date(startDate.getTime() - periodLength);
    const prevEnd = new Date(startDate.getTime());

    const previousReports = reports.filter((r) => {
      const d = new Date(r.date);
      return d >= prevStart && d < prevEnd;
    });

    const currentCount = filteredReports.length;
    const previousCount = previousReports.length;

    if (previousCount === 0) return currentCount > 0 ? 100 : 0;

    return Math.round(((currentCount - previousCount) / previousCount) * 100);
  };

  const growthPercentage = calculateGrowth();

  // EXPORT PDF
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("System Activity Report", 14, 20);

    doc.setFontSize(10);
    doc.text(
      `From: ${startDate.toLocaleDateString()}  To: ${endDate.toLocaleDateString()}`,
      14,
      28,
    );

    doc.text(`Activity Growth: ${growthPercentage}%`, 14, 35);

    const tableColumn = ["Name", "Role", "Action", "Date"];
    const tableRows = [];

    filteredReports.forEach((report) => {
      tableRows.push([
        report.name,
        report.role,
        report.action,
        new Date(report.date).toLocaleDateString(),
      ]);
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [52, 73, 94] },
    });

    doc.save("System_Report.pdf");
  };

  return (
    <div className="reports-container">
      <h2 className="page-title">Manager Reports</h2>

      {error && <p className="text-warning">{error}</p>}

      {/* SUMMARY CARDS */}
      <div className="summary-cards">
        <div className="card">
          <h4>Technician</h4>
          <p>{technicianCount}</p>
        </div>
        <div className="card">
          <h4>Dep-Staff</h4>
          <p>{depStaffCount}</p>
        </div>
        <div className="card">
          <h4>Pharmacy Store</h4>
          <p>{pharmacyCount}</p>
        </div>
        <div className="card growth-card">
          <h4>Activity Growth</h4>
          <p className={growthPercentage >= 0 ? "positive" : "negative"}>
            {growthPercentage >= 0
              ? `+${growthPercentage}%`
              : `${growthPercentage}%`}
          </p>
        </div>
      </div>

      {/* DATE FILTER */}
      <div className="filters">
        <div className="date-field">
          <label>Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            className="date-input"
          />
        </div>
        <div className="date-field">
          <label>End Date</label>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            className="date-input"
          />
        </div>
        <button className="export-btn" onClick={exportPDF}>
          Export PDF
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="report-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Action</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length > 0 ? (
              filteredReports.map((r, i) => (
                <tr key={i}>
                  <td>{r.name}</td>
                  <td>{r.role}</td>
                  <td>{r.action}</td>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="no-data">
                  No reports found for selected range
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reports;
