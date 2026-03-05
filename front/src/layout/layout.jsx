// src/layouts/Layout.jsx
import React, { useState, useEffect } from "react";
import Topbar from "../layout/Topbar.jsx";
import Sidebar from "../layout/Sidebar.jsx";

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

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

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Sidebar */}
      <div
        style={{
          position: isDesktop ? "relative" : "fixed",
          left: isSidebarOpen ? 0 : "-250px",
          top: 80,
          height: "100%",
          width: "250px",
          background: "#1E1E2F",
          transition: "left 0.3s ease",
          zIndex: 2000,
        }}
      >
        <Sidebar />
      </div>

      {/* Overlay for mobile */}
      {!isDesktop && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.4)",
            zIndex: 1500,
          }}
        />
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          marginLeft: isDesktop ? "2px" : "0",
          transition: "margin-left 0.3s ease",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          position: "relative", // important: makes children stack inside
        }}
      >
        <Topbar toggleSidebar={toggleSidebar} isDesktop={isDesktop} />
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "1rem",
            minWidth: 0, // important: prevents flex content from overflowing
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
