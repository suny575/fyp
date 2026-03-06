import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/report.css";
import { AuthContext } from "../../../../context/AuthContext.jsx";

const Reports = () => {
  const { token } = useContext(AuthContext); // get auth token
  const today = new Date();
  const pastMonth = new Date();
  pastMonth.setMonth(today.getMonth() - 1);

  const [startDate, setStartDate] = useState(pastMonth);
  const [endDate, setEndDate] = useState(today);
  const [roleFilter, setRoleFilter] = useState(""); // Technician / DepStaff / PharmacyStore
  const [userFilter, setUserFilter] = useState("");
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ===== FETCH USERS =====
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/manager/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to load users");
    }
  };

  // ===== FETCH REPORTS (tasks, faults, stock) =====
  const fetchReports = async () => {
    setLoading(true);

    try {
      const equipmentRes = await axios.get(
        "http://localhost:5000/api/equipment",
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const tasksRes = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const faultsRes = await axios.get("http://localhost:5000/api/faults", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const stockRes = await axios.get(
        "http://localhost:5000/api/stock-requests",
        { headers: { Authorization: `Bearer ${token}` } },
      );

      const mergedReports = [];

      // ✅ Technician → Completed Tasks ONLY
      tasksRes.data
        .filter((t) => t.status === "completed")
        .forEach((t) => {
          mergedReports.push({
            name: t.assignedTo?.name || "Unknown",
            role: "technician",
            action: "Completed Task",
            related: t.taskTitle || "Task",
            date: t.updatedAt,
          });
        });

      // ✅ DepStaff → Fault Reports
      faultsRes.data.forEach((f) => {
        mergedReports.push({
          name: f.reportedBy?.name || "Unknown",
          role: "depStaff",
          action: "Reported Fault",
          related: f.faultTitle || "Fault",
          date: f.createdAt,
        });
      });

      // ✅ DepStaff → Stock Requests
      stockRes.data
        .filter((s) => s.requestedBy)
        .forEach((s) => {
          mergedReports.push({
            name: s.requestedBy?.name || "Unknown",
            role: "depStaff",
            action: "Requested Stock",
            related: s.itemName || "Stock",
            date: s.createdAt,
          });
        });

      // ✅ PharmacyStore → Equipment Registration
      equipmentRes.data.forEach((e) => {
        mergedReports.push({
          name: e.createdBy?.name || "PharmacyStore",
          role: "pharmacyStore",
          action: "Registered Equipment",
          related: e.name || "Equipment",
          date: e.createdAt,
        });
      });

      setReports(mergedReports);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchReports();
  }, []);

  // ===== FILTERED REPORTS =====
  const filteredReports = reports
    .filter((r) => {
      const d = new Date(r.date);
      return d >= startDate && d <= endDate;
    })
    .filter((r) => (roleFilter ? r.role === roleFilter : true))
    .filter((r) =>
      userFilter
        ? r.name.toLowerCase().includes(userFilter.toLowerCase())
        : true,
    );

  // ===== USER SUMMARY COUNTS =====
  const technicianCount = users.filter((u) => u.role === "technician").length;
  const depStaffCount = users.filter((u) => u.role === "depStaff").length;
  const pharmacyCount = users.filter((u) => u.role === "pharmacyStore").length;

  // ===== ACTIVITY GROWTH =====
  const calculateGrowth = () => {
    const periodLength = endDate.getTime() - startDate.getTime();
    const prevStart = new Date(startDate.getTime() - periodLength);
    const prevEnd = new Date(startDate.getTime());

    const prevReports = reports.filter((r) => {
      const d = new Date(r.date);
      return d >= prevStart && d < prevEnd;
    });

    const currentCount = filteredReports.length;
    const previousCount = prevReports.length;
    if (previousCount === 0) return currentCount > 0 ? 100 : 0;
    return Math.round(((currentCount - previousCount) / previousCount) * 100);
  };
  const growthPercentage = calculateGrowth();




  // ===== EXPORT PDF =====
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Maintenance System Report", 14, 20);

    doc.setFontSize(10);
    doc.text(
      `From: ${startDate.toLocaleDateString()}  To: ${endDate.toLocaleDateString()}`,
      14,
      28,
    );
    doc.text(`Activity Growth: ${growthPercentage}%`, 14, 35);

    // ✅ Add summary of users
    doc.text(`Total Technicians: ${technicianCount}`, 14, 42);
    doc.text(`Total DepStaff: ${depStaffCount}`, 14, 48);
    doc.text(`Total Pharmacy Stores: ${pharmacyCount}`, 14, 54);

    // Table
    const tableColumn = ["Name", "Role", "Action", "Related", "Date"];
    const tableRows = filteredReports.map((r) => [
      r.name,
      r.role,
      r.action,
      r.related,
      new Date(r.date).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 60,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [52, 73, 94] },
    });

    doc.save("Maintenance_Report.pdf");
  };

  return (
    <div className="reports-container">
      <h2 className="page-title">Manager Reports</h2>
      {/* ERROR */}
      {error && <p className="text-warning">{error}</p>}
      <div className="filters">
        <div className="filter-group">
          <label>Filter by date</label>
          <div className="date-range">
            <DatePicker selected={startDate} onChange={setStartDate} />
            <DatePicker selected={endDate} onChange={setEndDate} />
          </div>
        </div>

        <div className="filter-group">
          <label>Filter by role</label>
          <select onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="technician">Technician</option>
            <option value="depStaff">DepStaff</option>
            <option value="pharmacyStore">PharmacyStore</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Search user</label>
          <input
            type="text"
            placeholder="Enter name..."
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          />
        </div>

        <button onClick={exportPDF}>Export PDF</button>
      </div>
      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredReports.length > 0 ? (
        <div className="table-wrapper">
          <table className="report-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Action</th>
                <th>Related</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((r, i) => (
                <tr key={i} className="clickable-row">
                  <td>{r.name}</td>
                  <td>{r.role}</td>
                  <td>{r.action}</td>
                  <td>{r.related}</td>
                  <td>{new Date(r.date).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No reports found for the selected filters</p>
      )}
      {/* MOBILE CARDS */}
      <div className="mobile-report-cards">
        {filteredReports.map((r, i) => (
          <div key={i} className="report-card">
            <div className="card-header">
              <span className="user-name">{r.name}</span>
              <span className={`role-badge ${r.role}`}>{r.role}</span>
            </div>

            <div className="card-body">
              <div className="card-row">
                <span className="label">Action</span>
                <span className="value action">{r.action}</span>
              </div>

              <div className="card-row">
                <span className="label">Related</span>
                <span className="value">{r.related}</span>
              </div>

              <div className="card-row">
                <span className="label">Date</span>
                <span className="value">
                  {new Date(r.date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reports;
