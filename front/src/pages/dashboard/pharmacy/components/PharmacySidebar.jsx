// PharmacySidebar.jsx
import React from "react";
import "../styles/PharmacySidebar.css";

const PharmacySidebar = () => {
  return (
    <div className="pharmacy-sidebar">
      <h2 className="sidebar-title">Pharmacy</h2>
      <ul>
        <li><a href="/pharmacy"> Dashboard</a></li>
        <li><a href="/pharmacy/equipment">Equipment</a></li>
        <li><a href="/pharmacy/stock">Stock</a></li>
        <li><a href="/pharmacy/allocation">Allocation</a></li>
        <li><a href="/pharmacy/reports">Reports</a></li>
        <li><a href="/pharmacy/alerts">Alerts</a></li>
      </ul>
    </div>
  );
};

export default PharmacySidebar;