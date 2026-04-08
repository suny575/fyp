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
        paddingTop: "90px",
        overflowY: "auto",
        color: "#fff",
      }}
    >
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {menus.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              onClick={!isDesktop ? closeSidebar : undefined}
              style={({ isActive }) => ({
                display: "block",
                padding: "14px 24px",
                textDecoration: "none",
                color: isActive ? "#fff" : "#cbd5e1",
                background: isActive
                  ? "linear-gradient(90deg, #6366f1, #8b5cf6)"
                  : "transparent",
                borderRadius: "8px",
                margin: "6px 14px",
                fontSize: "15px",
                fontWeight: isActive ? "600" : "400",
                transition: "all 0.25s ease",
              })}
              onMouseEnter={(e) => {
                if (!e.target.classList.contains("active")) {
                  e.target.style.background = "rgba(255,255,255,0.08)";
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.classList.contains("active")) {
                  e.target.style.background = "transparent";
                }
              }}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
