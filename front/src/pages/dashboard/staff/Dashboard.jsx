import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Topbar from "./components/Topbar.jsx";
import Overview from "./components/Overview.js";
import Fault from "./components/Faults.jsx";
import StockRequestForm from "./components/StockRequestForm.js";
// import Equipment from "./components/Equipments.jsx";
import Notifications from "./components/Notifications";
import "./styles/Dashboard.css";

const DepStaffDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleTabClick = (tab) => {
    // update route instead of state
    switch (tab) {
      case "overview":
        navigate("overview");
        break;
      case "faults":
        navigate("faults");
        break;
      case "stocks":
        navigate("stock-request");
        break;
      case "notifications":
        navigate("notifications");
        break;
      default:
        navigate("overview");
    }
  };

  return (
    <div className="dashboard-layout my-5">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        onTabClick={handleTabClick}
      />

      <div className="main-section">
        <Topbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          goToNotifications={() => handleTabClick("notifications")}
        />

        <div className="content-area container-fluid py-4">
          <Routes>
            <Route path="overview" element={<Overview />} />
            <Route path="/faults" element={<Fault />} />
            {/* <Route path="equipment" element={<Equipment />} /> */}
            <Route path="/stocks" element={<StockRequestForm />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="*" element={<Navigate to="overview" />} />
          </Routes>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default DepStaffDashboard;
