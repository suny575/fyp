import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";

import AuthPage from "./pages/AuthPage";
import HowItWorks from "./pages/HowItWorks";
import ContactUs from "./pages/ContactUs";

import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import PharmacyDashboard from "./pages/dashboard/pharmacy/PharmacyDashboard.jsx";

import DepStaffDashboard from "./pages/dashboard/staff/Dashboard.jsx";
import ManagerDashboard from "./pages/dashboard/manager/ManagerDashboard.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import TDashboard from "./pages/dashboard/technician/tdashBoard.jsx";
import Footer from "./pages/Footer.jsx";
import NotificationsPage from "./pages/NotificationsPage.jsx";
import { NotificationsProvider } from "./pages/NotificationsPage";
import RoleRoute from "./components/routing/RoleRoute.jsx";

function App() {
  return (
    <AuthProvider>
      <NotificationsProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aboutus" element={<AboutUs />} />

            <Route path="/auth" element={<AuthPage />} />
            <Route path="/howitworks" element={<HowItWorks />} />
            <Route
              path="/staff/*"
              element={
                <RoleRoute allowedRoles={["depstaff"]}>
                  <DepStaffDashboard />
                </RoleRoute>
              }
            />
            <Route path="/contactus" element={<ContactUs />} />
            <Route
              path="/manager/*"
              element={
                <RoleRoute allowedRoles={["maintenancemanager"]}>
                  <ManagerDashboard />
                </RoleRoute>
              }
            />

            <Route
              path="/admin/*"
              element={
                <RoleRoute allowedRoles={["admin"]}>
                  <AdminDashboard />
                </RoleRoute>
              }
            />
            <Route
              path="/pharmacy/*"
              element={
                <RoleRoute allowedRoles={["pharmacystore"]}>
                  <PharmacyDashboard />
                </RoleRoute>
              }
            />

            <Route
              path="/technician/*"
              element={
                <RoleRoute allowedRoles={["technician"]}>
                  <TDashboard />
                </RoleRoute>
              }
            />

            <Route path="/notifications" element={<NotificationsPage />} />
          </Routes>
          <Footer />
        </Router>
      </NotificationsProvider>
    </AuthProvider>
  );
}

export default App;
