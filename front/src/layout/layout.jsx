// src/layouts/Layout.jsx
import React, { useState, useEffect } from "react";
import Topbar from "../layout/Topbar.jsx";
import Sidebar from "../layout/Sidebar.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import useDashboardBackNavigation from "../hooks/useDashboardBackNavigation.js";
import { normalizeRoleKey, roleMainPaths } from "../utils/roleRoutes.js";

const Layout = ({ children }) => {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const roleKey = normalizeRoleKey(user?.role);

  useDashboardBackNavigation({
    mainPaths: roleMainPaths[roleKey] || [],
    exitMessage: "Do you want to exit the app?",
    exitTo: "/",
  });

  useEffect(() => {
    const handleResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);

      if (desktop) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (!isDesktop) {
      setIsSidebarOpen((prev) => !prev);
    }
  };

  const closeSidebar = () => {
    if (!isDesktop) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#f4f6f9",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          position: isDesktop ? "relative" : "fixed",
          left: isSidebarOpen ? "0" : "-260px",
          top: 70,
          height: "100%",
          width: "260px",
          background: "linear-gradient(180deg, #1E1E2F, #25253a)",
          transition: "left 0.35s ease",
          zIndex: 2000,
          boxShadow: isSidebarOpen ? "4px 0 20px rgba(0,0,0,0.25)" : "none",
        }}
      >
        <Sidebar closeSidebar={closeSidebar} isDesktop={isDesktop} />
      </div>

      {/* Overlay for mobile */}
      {!isDesktop && isSidebarOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(3px)",
            zIndex: 1500,
            transition: "opacity 0.3s ease",
          }}
        />
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative",
          transition: "all 0.3s ease",
        }}
      >
        <Topbar
          toggleSidebar={toggleSidebar}
          isDesktop={isDesktop}
          isSidebarOpen={isSidebarOpen}
        />

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1.5rem",
            minWidth: 0,
            background: "#f4f6f9",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
