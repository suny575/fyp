import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
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
        <Route path="" element={<Overview />} />
        <Route path="overview" element={<Overview />} />
        <Route path="users" element={<UserManagment />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="schedules" element={<Schedules />} />
      </Routes>
    </Layout>
  );
};

export default ManagerDashboard;
