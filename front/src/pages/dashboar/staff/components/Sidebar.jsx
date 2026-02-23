import React from "react";
import "../styles/Dashboard.css";

const Sidebar = ({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const menuItems = [
    { key: "overview", label: "Overview" },
    { key: "faultReport", label: "Submit Fault" },
    { key: "faultStatus", label: "Track Faults" },
    { key: "equipment", label: "Equipment" },
    { key: "stockRequest", label: "Stock Requests" },
    { key: "notifications", label: "Notifications" },
  ];

  return (
    <>
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <ul className="nav flex-column gap-2">
          {menuItems.map((item) => (
            <li key={item.key}>
              <button
                className={`btn w-100 text-start fw-semibold ${
                  activeTab === item.key
                    ? "btn-primary text-white shadow-sm"
                    : "btn-outline-primary"
                }`}
                onClick={() => {
                  setActiveTab(item.key);
                  setSidebarOpen(false); // close on mobile
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
