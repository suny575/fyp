import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const handleClickLink = () => {
    // Close sidebar automatically on mobile
    if (sidebarOpen && window.innerWidth < 768) toggleSidebar();
  };

  return (
    <div className={`td-sidebar ${sidebarOpen ? "open" : ""}`}>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink
            to="/technician"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={handleClickLink}
          >
            Overview
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/technician/tasks"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={handleClickLink}
          >
            Tasks
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/technician/report"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={handleClickLink}
          >
            Reports
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink
            to="/technician/notifications"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={handleClickLink}
          >
            Notifications
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
