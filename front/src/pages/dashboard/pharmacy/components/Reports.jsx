import React, { useState, useEffect } from "react";
import "../styles/Reports.css";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  XAxis, YAxis,
  Tooltip, Legend,
  ResponsiveContainer
} from "recharts";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { getStoredToken } from "../../../../utils/authStorage.js";

const REPORT_TYPES = ["Inventory", "Usage", "Low Stock", "Expiry"];
const COLORS = ["#0ea5e9", "#f97316", "#16a34a", "#eab308", "#ef4444"];

const PharmacyReports = () => {

  const [reportType, setReportType] = useState("Inventory");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);

  // ================= FETCH FROM BACKEND =================
  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const token = getStoredToken();
        const query = new URLSearchParams({
          reportType,
          dateFrom,
          dateTo
        }).toString();

    
        const res = await fetch(`http://localhost:5000/api/reports?${query}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        setFilteredData(data.records || []);
        setSummary(data.summary || {});
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [reportType, dateFrom, dateTo]);

  // ================= EXPORT =================
  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`Pharmacy ${reportType} Report`, 10, 10);

    const tableColumn = ["Type", "Name", "Category", "Department", "Quantity", "Allocated By", "Date"];
    const tableRows = filteredData.map(item => [
      item.type,
      item.name,
      item.category || "-",
      item.department || "-",
      item.quantity || "-",
      item.allocatedBy || "-",
      new Date(item.date).toLocaleDateString()
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    doc.save(`${reportType}_Report.pdf`);
  };

  const exportExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${reportType}_Report.xlsx`);
  };

  // ================= CHART DATA =================
  const pieData = [];
  const barData = [];

  if (reportType === "Inventory") {
    const categoryCounts = {};
    filteredData.forEach(item => {
      categoryCounts[item.category] =
        (categoryCounts[item.category] || 0) + 1;
    });

    Object.keys(categoryCounts).forEach(key => {
      pieData.push({ name: key, value: categoryCounts[key] });
    });
  }

  if (reportType === "Low Stock") {
    filteredData.forEach(item => {
      barData.push({
        name: item.name,
        quantity: item.quantity
      });
    });
  }

  if (reportType === "Usage") {
    const usageByDept = {};
    filteredData.forEach(item => {
      usageByDept[item.department] =
        (usageByDept[item.department] || 0) + 1;
    });

    Object.keys(usageByDept).forEach(key => {
      barData.push({
        department: key,
        quantity: usageByDept[key]
      });
    });
  }

  if (reportType === "Expiry") {
    pieData.push({ name: "Expired", value: filteredData.length });
  }

  return (
    <div className="reports-container">
      <h3>Pharmacy Reports Dashboard</h3>

      <div className="filters">
        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          {REPORT_TYPES.map(type => <option key={type}>{type}</option>)}
        </select>

        <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
        <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />

        <button onClick={exportPDF}>Export PDF</button>
        <button onClick={exportExcel}>Export Excel</button>
      </div>
      {loading ? (
        <div className="pharmacy-page-loading">
          <div className="pharmacy-dotted-loader" />
          <p className="pharmacy-loading-text">Loading reports...</p>
        </div>
      ) : (
        <>

      {/* Summary */}
      <div className="summary-cards">
        {reportType === "Inventory" && (
          <>
            <div>Total Equipment: {summary.totalEquipment}</div>
            <div>Total Stock: {summary.totalStock}</div>
          </>
        )}

        {reportType === "Low Stock" && (
          <div>Total Low Items: {summary.totalLowItems}</div>
        )}

        {reportType === "Expiry" && (
          <div>Total Expired: {summary.totalExpired}</div>
        )}

        {reportType === "Usage" && (
          <div>Total Allocations: {summary.totalAllocations}</div>
        )}
      </div>

      {/* Charts */}
      <div className="charts">
        {pieData.length > 0 && (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={100} label>
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
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
              <Legend />
              <Bar dataKey="quantity" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table */}
      <div className="report-table-wrapper">
         <h3>Report Records</h3>
  <div className="report-table-scroll">

  
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
              <td>{item.category}</td>
              <td>{item.department}</td>
              <td>{item.quantity}</td>
              <td>{item.allocatedBy}</td>
              <td>{new Date(item.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      </div>
      </>
      )}
    </div>
  );
};

export default PharmacyReports;
