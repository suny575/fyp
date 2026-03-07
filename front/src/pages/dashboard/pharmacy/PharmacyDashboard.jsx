
// PharmacyDashboard.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";      //, Navigate

// import PharmacySidebar from "./components/PharmacySidebar";
// import PharmacyTopbar from "./components/PharmacyTopbar";
import PharmacyHome from "./components/PharmacyHome";
// import PharmacyEditProfile from "./components/PharmacyEditProfile";
import EquipmentManagement from "./components/EquipmentManagement";
import StockManagement from "./components/StockManagement";
import Allocation from "./components/Allocation";
import Reports from "./components/Reports";
import Alerts from "./components/Alerts";

// import "./styles/PharmacyDashboard.css";

const PharmacyDashboard = () => {
  return (
    // <div className="pharmacy-layout">
    //   <PharmacySidebar />

    //   <div className="pharmacy-main">
    //     <PharmacyTopbar />

        <div className="pharmacy-content">
          <Routes>
            {/* Default page */}
            <Route index element={< PharmacyHome/>} />

            {/* Pages */}
            <Route path="home" element={<PharmacyHome />} />
            <Route path="equipment" element={<EquipmentManagement />} />
            <Route path="stock" element={<StockManagement />} />
            <Route path="allocation" element={<Allocation />} />
            <Route path="reports" element={<Reports />} />
            <Route path="alerts" element={<Alerts />} />
            {/* <Route path="edit-profile" element={<PharmacyEditProfile />} /> */}
          </Routes>
        </div>
    //   </div>
    // </div>
  );
};

export default PharmacyDashboard;