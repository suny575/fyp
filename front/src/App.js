


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AboutUs from "./pages/AboutUs";

import AuthPage from "./pages/AuthPage";
import HowItWorks from "./pages/HowItWorks";
import ContactUs from "./pages/ContactUs";

import AdminDashboard from "./pages/dashboard/admin/AdminDashboard";
import PharmacyDashboard from "./pages/dashboard/pharmacy/PharmacyDashboard";

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/howitworks" element={<HowItWorks />} />
        <Route path="/contactus" element={<ContactUs />} />

        <Route path="/admin/*" element={<AdminDashboard />} />
        <Route path="/pharmacy/*" element={<PharmacyDashboard />} />
      </Routes>

    </Router>
  );
}

export default App;
