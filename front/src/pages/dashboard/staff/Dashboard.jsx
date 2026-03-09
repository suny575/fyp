import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../../../layout/layout.jsx";
import Overview from "./components/Overview.js";
import Fault from "./components/Faults.jsx";
import StockRequestForm from "./components/StockRequestForm.js";
// import Notifications from "./components/Notifications.jsx";

const DepStaffDashboard = () => {
  return (
    <Layout>
      <Routes>
        <Route path="overview" element={<Overview />} />
        <Route path="faults" element={<Fault />} />
        <Route path="stocks" element={<StockRequestForm />} />
        {/* <Route path="notifications" element={<Notifications />} /> */}
        <Route path="*" element={<Navigate to="overview" />} />
      </Routes>
    </Layout>
  );
};

export default DepStaffDashboard;
