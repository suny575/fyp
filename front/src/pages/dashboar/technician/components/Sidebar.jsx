import React from "react";

const Sidebar = ({ activeView, setActiveView, sidebarOpen, toggleSidebar }) => {
  const handleClickLink = (view) => {
    setActiveView(view);
    // Close sidebar automatically on mobile
    if (sidebarOpen && window.innerWidth < 768) toggleSidebar();
  };

  return (
    <div className={`td-sidebar ${sidebarOpen ? "open" : ""}`}>
      <ul className="nav flex-column">
        <li className="nav-item">
          <button
            className={`nav-link ${activeView === "dashboard" ? "active" : ""}`}
            onClick={() => handleClickLink("dashboard")}
          >
          Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeView === "tasks" ? "active" : ""}`}
            onClick={() => handleClickLink("tasks")}
          >
            Tasks
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeView === "report" ? "active" : ""}`}
            onClick={() => handleClickLink("report")}
          >
            Reports
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeView === "notifications" ? "active" : ""}`}
            onClick={() => handleClickLink("notifications")}
          >
            Notifications
          </button>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
