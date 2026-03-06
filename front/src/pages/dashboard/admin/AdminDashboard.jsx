import React from "react";
import { Routes, Route } from "react-router-dom";

// import Sidebar from "./components/Sidebar";
// import Topbar from "./components/Topbar";
import ManagersList from "./components/ManagersList";
import DashboardHome from "./components/DashboardHome";
// import ManagerForm from "./components/ManagerForm";
import Reports from "./components/Reports";
import Notifications from "./components/Notifications";
import Settings from "./components/Settings";
import SystemLogs from "./components/SystemLogs";
// import EditProfile from "./components/EditProfile";

// import "./styles/AdminDashboard.css";
// import DashboardHome from "./components/DashboardHome";

const AdminDashboard = () => {
  return (
    // <div className="admin-layout">
    //   <Sidebar />

    //   <div className="main-content">
    //     <Topbar />

        <div className="content-area">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="dashboardhome" element={<DashboardHome/>} />
            <Route path="managers" element={<ManagersList />} />
            {/* <Route path="manager/new" element={<ManagerForm />} /> */}
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="settings" element={<Settings />} />
            <Route path="system-logs" element={<SystemLogs />} />
            {/* <Route path="edit-profile" element={<EditProfile />} /> */}
          </Routes>
        </div>
    //   </div>
    // </div>
  );
};

export default AdminDashboard;
