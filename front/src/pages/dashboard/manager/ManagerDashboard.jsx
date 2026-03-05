import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { io } from "socket.io-client";
import Overview from "./components/Overview";
import Notifications from "./components/Notifications";
import UserManagment from "./components/UserManagment.jsx";
import ReportsPage from "./components/Reports";
import Settings from "./components/Settings";
import Layout from "../../../layout/layout.jsx";

const socket = io("http://localhost:5000");

const ManagerDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route path="overview" element={<Overview />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="user" element={<UserManagment />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<Settings />} />
      </Routes>
    </Layout>
  );
};

export default ManagerDashboard;
