// src/pages/dashboard/manager/ManagerDashboard.jsx

import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Overview from "./components/Overview";
import TechnicianManagement from "./components/TechnicianManagement";
import DepStaffManagement from "./components/DepStaffManagement";
import PharmacyStoreManagement from "./components/PharmacyStoreManagement";
import UserDetails from "./components/UserDetails";
import ReportsPage from "./components/Reports"
import Footer from "./components/Footer";
import "./styles/ManagerDashboard.css";
import Settings from "./components/Settings";

const ManagerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
    setProfileOpen(false);
    setNotificationOpen(false);
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
    setNotificationOpen(false);
  };

  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
    setProfileOpen(false);
  };

  const closeAll = () => {
    setSidebarOpen(false);
    setProfileOpen(false);
    setNotificationOpen(false);
  };

  return (
    <div className="dashboard-layout">
      <Sidebar
        sidebarOpen={sidebarOpen}
        closeSidebar={() => setSidebarOpen(false)}
      />

      <div className="main-section">
        <Topbar
          toggleSidebar={toggleSidebar}
          profileOpen={profileOpen}
          toggleProfile={toggleProfile}
          notificationOpen={notificationOpen}
          toggleNotification={toggleNotification}
        />

        {sidebarOpen && <div className="overlay" onClick={closeAll}></div>}

        <div className="content-area">
          <Routes>
            {/* DEFAULT PAGE */}
            <Route index element={<Overview />} />
            <Route path="overview" element={<Overview />} />
            <Route path="technician" element={<TechnicianManagement />} />
            <Route path="technician/:id" element={<UserDetails />} />
            <Route path="depstaff" element={<DepStaffManagement />} />
            <Route path="depstaff/:id" element={<UserDetails />} />
            <Route path="pharmacystore" element={<PharmacyStoreManagement />} />
            <Route path="pharmacystore/:id" element={<UserDetails />} />
            <Route path="/reports" element ={<ReportsPage />} />
              <Route path="/settings" element ={<Settings />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
