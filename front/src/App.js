// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import AboutUs from "./pages/AboutUs";
import HowItWorks from "./pages/HowItWorks.jsx";
import Stock from "./pages/Stock.jsx";
import ContactUs from "./pages/ContactUs.jsx";
import DepStaffDashboard from "./pages/dashboar/staff/Dashboard.jsx.jsx";
import ManagerDashboard from "./pages/dashboar/manager/ManagerDashboard.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import TDashboard from "./pages/dashboar/technician/tdashBoard.jsx";
import Footer from "./pages/Footer.jsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/stock" element={<Stock />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/howitworks" element={<HowItWorks />} />
          <Route path="/staff" element={<DepStaffDashboard />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/manager/*" element={<ManagerDashboard />} />

          <Route path="/technician/*" element={<TDashboard />} />
        </Routes>
          <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
