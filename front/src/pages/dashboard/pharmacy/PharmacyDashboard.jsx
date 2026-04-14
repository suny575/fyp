import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
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
            <Route index element={<PharmacyHome />} />

            {/* Pages */}
            <Route path="home" element={<Navigate to="/pharmacy" replace />} />
            <Route path="equipment" element={<EquipmentManagement />} />
            <Route path="stock" element={<StockManagement />} />
            <Route path="allocation" element={<Allocation />} />
            <Route path="reports" element={<Reports />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="*" element={<Navigate to="/pharmacy" replace />} />
          </Routes>
          </Layout>
  );
};

export default PharmacyDashboard;
