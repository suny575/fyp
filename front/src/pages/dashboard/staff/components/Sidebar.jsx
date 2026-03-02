import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: "/staff/overview", label: "Overview" },
    { path: "/staff/notifications", label: "Notifications" },
    { path: "/staff/faults", label: "Faults" },
    // { path: "equipment", label: "Equipment" },
    { path: "/staff/stocks", label: "Stock Requests" },
  ];

  const handleClick = (path) => {
    navigate(path);
    setSidebarOpen(false); // close sidebar on mobile
  };

  const getActiveClass = (path) =>
    location.pathname.endsWith(path)
      ? "btn-primary text-white shadow-sm"
      : "btn-outline-primary";

  return (
    <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
      <ul className="nav flex-column gap-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <button
              className={`btn w-100 text-start fw-semibold ${getActiveClass(item.path)}`}
              onClick={() => handleClick(item.path)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
