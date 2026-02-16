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

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/stock" element={<Stock />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/howitworks" element={<HowItWorks />} />
        <Route path="/contactus" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

export default App;
