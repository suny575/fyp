


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


function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
        
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/howitworks" element={<HowItWorks />} />
          <Route path="/staff" element={<DepStaffDashboard />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/manager/*" element={<ManagerDashboard />} />

           <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/pharmacy/*" element={<PharmacyDashboard />} />

          <Route path="/technician/*" element={<TDashboard />} />
        </Routes>
          <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
