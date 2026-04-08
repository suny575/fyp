import React from "react";
import { Routes, Route } from "react-router-dom";     
import PharmacyHome from "./components/PharmacyHome";
import EquipmentManagement from "./components/EquipmentManagement";
import StockManagement from "./components/StockManagement";
import Allocation from "./components/Allocation";
import Reports from "./components/Reports";
import Alerts from "./components/Alerts";
import Layout from "../../../layout/layout.jsx";

const PharmacyDashboard = () => {
  return (
          <Layout>
          <Routes>
          
            <Route path ="" element={< PharmacyHome/>} />

            {/* Pages */}
            <Route path="home" element={<PharmacyHome />} />
            <Route path="equipment" element={<EquipmentManagement />} />
            <Route path="stock" element={<StockManagement />} />
            <Route path="allocation" element={<Allocation />} />
            <Route path="reports" element={<Reports />} />
            <Route path="alerts" element={<Alerts />} />
          </Routes>
          </Layout>
  );
};

export default PharmacyDashboard;