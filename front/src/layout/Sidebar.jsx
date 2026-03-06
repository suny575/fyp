import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { sidebarMenus } from "../config/sidebarConfig";

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  if (!user) return null;

  const roleKey = user.role?.toLowerCase();
  const menus = sidebarMenus[roleKey] || [];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#1E1E2F",
        paddingTop: "20px",
        overflowY: "auto",
      }}
    >
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {menus.map((item) => (
          <li key={item.path}>
            <NavLink
              to={item.path}
              style={({ isActive }) => ({
                display: "block",
                padding: "12px 20px",
                textDecoration: "none",
                color: isActive ? "#ffffff" : "#cbd5e1",
                backgroundColor: isActive ? "#ccd2dc" : "transparent",
                transition: "all 0.2s ease",
              })}
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
