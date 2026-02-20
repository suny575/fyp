import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Overview from "./components/Overview";
import FaultReportForm from "./components/FaultReportForm";
import FaultStatusList from "./components/FaultStatusList";
import StockRequestForm from "./components/StockRequestForm";
import DepartmentEquipment from "./components/DepartmentEquipment";
import Notifications from "./components/Notifications";
import Footer from "./components/Footer"
import "./styles/Dashboard.css";

const DepStaffDashboard = () => {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token");

        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.role !== "depStaff") throw new Error("Unauthorized");

        setUser({
          ...res.data,
          notificationCount: res.data.notificationCount || 3,
        });
      } catch (err) {
        console.warn("Using mock user");

        setUser({
          name: "Department Staff",
          department: "IT",
          role: "depStaff",
          notificationCount: 3, // important for badge
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "faultReport":
        return <FaultReportForm />;
      case "faultStatus":
        return <FaultStatusList />;
      case "equipment":
        return <DepartmentEquipment />;
      case "stockRequest":
        return <StockRequestForm />;
      case "notifications":
        return <Notifications />;
      default:
        return <Overview />;
    }
  };

  if (loading)
    return (
      <div className="vh-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" />
      </div>
    );

  return (
    <div className="dashboard-layout">
      <Sidebar
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="main-section">
        <Topbar
          user={user}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          goToNotifications={() => setActiveTab("notifications")}
        />

        <div className="content-area container-fluid py-4">
          {renderContent()}
        </div>
      </div>

      {/* Overlay for small screens */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
          <Footer />
    </div>

  );
};

export default DepStaffDashboard;
