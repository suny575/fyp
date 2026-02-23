import React from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaUsers, FaFileAlt, FaCog } from "react-icons/fa";
import "../styles/Sidebar.css";

const Sidebar = ({ sidebarOpen, closeSidebar }) => {
  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <h4 className="sidebar-title">Manager</h4>

      <NavLink to="." end className="nav-link" onClick={closeSidebar}>
        <FaTachometerAlt /> Overview
      </NavLink>

      <NavLink to="/manager/overview">Overview</NavLink>

      <NavLink
        to="/manager/technician"
        className="nav-link"
        onClick={closeSidebar}
      >
        <FaUsers /> Technicians
      </NavLink>

      <NavLink
        to="/manager/depstaff"
        className="nav-link"
        onClick={closeSidebar}
      >
        <FaUsers /> Department Staff
      </NavLink>

      <NavLink
        to="/manager/pharmacystore"
        className="nav-link"
        onClick={closeSidebar}
      >
        <FaUsers /> Pharmacy Store
      </NavLink>

      <NavLink
        to="/manager/reports"
        className="nav-link"
        onClick={closeSidebar}
      >
        <FaFileAlt /> Reports
      </NavLink>

      <NavLink
        to="/manager/settings"
        className="nav-link"
        onClick={closeSidebar}
      >
        <FaCog /> Settings
      </NavLink>
    </div>
  );
};

export default Sidebar;
