import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { io } from "socket.io-client";
import Overview from "./components/Overview";
import UserManagment from "./components/UserManagment.jsx";
import ReportsPage from "./components/Reports";
import Schedules from "./components/ScheduledMaintenance.jsx";
import Layout from "../../../layout/layout.jsx";

const socket = io("http://localhost:5000");

const ManagerDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="overview" element={<Navigate to="/manager" replace />} />
        <Route path="users" element={<UserManagment />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="schedules" element={<Schedules />} />
        <Route path="*" element={<Navigate to="/manager" replace />} />
      </Routes>
    </Layout>
  );
};

export default ManagerDashboard;
