import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Overview from "./components/Overview";
import Notifications from "./components/Notifications";
import UserManagment from "./components/UserManagment.jsx";
import ReportsPage from "./components/Reports";
import Settings from "./components/Settings";
import "./styles/ManagerDashboard.css";

const socket = io("http://localhost:5000");

const ManagerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [manager] = useState({
    firstName: "John",
    fullName: "John Doe",
    email: "john@example.com",
    phone: "123456789",
  });

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const closeSidebar = () => setSidebarOpen(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    socket.emit("register", userId);
    socket.on("notification", (data) => alert(data.message));
    return () => socket.off("notification");
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar sidebarOpen={sidebarOpen} closeSidebar={closeSidebar} />

      <div className="main-section">
        <Topbar
          toggleSidebar={toggleSidebar}
          sidebarOpen={sidebarOpen}
          manager={manager}
        />

        {/* Sidebar overlay for mobile */}
        {sidebarOpen && <div className="overlay" onClick={closeSidebar}></div>}

        <div className="content-area">
          <Routes>
            <Route index element={<Overview />} />
            <Route path="overview" element={<Overview />} />

            <Route path="notifications" element={<Notifications />} />
            <Route path="user" element={<UserManagment />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
