import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ sidebarOpen, toggleSidebar }) => {
  const handleClickLink = () => {
    if (sidebarOpen && window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <div className={`td-sidebar ${sidebarOpen ? "open" : ""}`}>
      <ul className="nav flex-column">
        <li className="nav-item">
          <NavLink
            to="/staff/overview"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={handleClickLink}
          >
            Overview
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/staff/faults"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={handleClickLink}
          >
            Faults
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/staff/stocks"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
            onClick={handleClickLink}
          >
            Stock Requests
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink
            to="/staff/notifications"
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
