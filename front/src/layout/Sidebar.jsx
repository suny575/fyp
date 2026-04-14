import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { sidebarMenus } from "../config/sidebarConfig";

const Sidebar = ({ closeSidebar, isDesktop }) => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const roleKey = user.role?.toLowerCase();
  const menus = sidebarMenus[roleKey] || [];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        paddingTop: "14px",
        paddingBottom: "20px",
        overflowY: "auto",
        color: "#fff",
      }}
    >
      <ul
        style={{
          listStyle: "none",
          padding: "0 10px",
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        {menus.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              onClick={!isDesktop ? closeSidebar : undefined}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "13px 16px",
                textDecoration: "none",
                color: isActive ? "#fff" : "#cbd5e1",
                background: isActive
                  ? "linear-gradient(135deg, #4f46e5, #7c3aed)"
                  : "rgba(255,255,255,0.02)",
                border: isActive
                  ? "1px solid rgba(255,255,255,0.22)"
                  : "1px solid transparent",
                borderRadius: "14px",
                fontSize: "15px",
                fontWeight: isActive ? "700" : "500",
                letterSpacing: "0.2px",
                boxShadow: isActive
                  ? "0 12px 24px rgba(79, 70, 229, 0.35)"
                  : "none",
                transform: isActive ? "translateX(4px)" : "translateX(0)",
                transition: "all 0.25s ease",
              })}
              onMouseEnter={(e) => {
                if (!e.currentTarget.classList.contains("active")) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!e.currentTarget.classList.contains("active")) {
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                  e.currentTarget.style.borderColor = "transparent";
                }
              }}
            >
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
