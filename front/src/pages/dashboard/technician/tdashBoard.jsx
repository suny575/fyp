import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Overview from "./components/overview";
import Task from "./components/Task";
import Report from "./components/report";
import Notification from "./components/Notification";
import "./styles/technician.css";

const TDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="td-wrapper">
      <Sidebar
        sidebarOpen={sidebarOpen}
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="td-main">
        <Topbar
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
        />

        <div className="container-fluid p-4">
          <Routes>
            {/* Default Overview */}
            <Route path="/" element={<Overview />} />

            {/* Child Routes */}
            <Route path="tasks" element={<Task />} />
            <Route path="report" element={<Report />} />
            <Route path="notifications" element={<Notification />} />

            {/* Redirect unknown /technician/* to Overview */}
            <Route path="*" element={<Navigate to="/technician" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default TDashboard;
