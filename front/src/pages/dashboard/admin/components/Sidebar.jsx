import React from "react";
import { NavLink } from "react-router-dom";
import "../styles/Sidebar.css";


const Sidebar = () => {
  return (
    <div className="sidebar">
      <h3 className="sidebar-title">
        Admin Panel
      </h3>

      <nav className="sidebar-nav">
        <NavLink to="/admin" end className="sidebar-link">
          Dashboard
        </NavLink>

        <NavLink to="/admin/managers" className="sidebar-link">
          Managers
        </NavLink>

        <NavLink to="/admin/notifications" className="sidebar-link">
          Notifications
        </NavLink>

        <NavLink to="/admin/reports" className="sidebar-link">
          Reports
        </NavLink>

        <NavLink to="/admin/settings" className="sidebar-link">
          Settings
        </NavLink>

        <NavLink to="/admin/system-logs" className="sidebar-link">
          System Logs
        </NavLink>
      </nav>
    </div>
  );
};

export default Sidebar;
