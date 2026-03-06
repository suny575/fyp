import React, { useState, useEffect, useRef, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Topbar = ({ toggleSidebar, isDesktop }) => {
  const { user, token } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const wrapperRef = useRef(null);

  // Fetch notifications for current user
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!token || !user) return;
      try {
        const res = await axios.get("http://localhost:5000/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userNotifs = res.data.filter((n) => n.recipient?._id === user._id);
        setNotifications(userNotifs);
      } catch (err) {
        console.error("Failed to fetch notifications:", err.message);
      }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 40000);
    return () => clearInterval(interval);
  }, [user, token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setEditOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        { ...editData },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated!");
      setEditOpen(false);
    } catch (err) {
      console.error("Failed to update profile:", err.message);
      alert("Update failed!");
    }
  };

  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  return (
    <div
      style={{
        marginTop: "80px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 1rem",
        background: "#e6e6ef",
        color: "#000",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* Left: Hamburger */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {!isDesktop && (
          <button
            onClick={toggleSidebar}
            style={{
              fontSize: "1.5rem",
              background: "transparent",
              border: "none",
              color: "#3312ef",
              cursor: "pointer",
            }}
          >
            ☰
          </button>
        )}
      </div>

      {/* Right: Notifications & Profile */}
      {user && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            position: "relative",
          }}
          ref={wrapperRef}
        >
          {/* Notifications */}
          <button
            style={{
              position: "relative",
              background: "#fff",
              borderRadius: "0.5rem",
              width: "2.5rem",
              height: "2.5rem",
              border: "none",
              fontSize: "1.2rem",
              cursor: "pointer",
            }}
          >
            🔔
            {notifications.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-0.3rem",
                  right: "-0.3rem",
                  background: "red",
                  color: "#fff",
                  borderRadius: "50%",
                  fontSize: "0.7rem",
                  width: "1rem",
                  height: "1rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {notifications.length}
              </span>
            )}
          </button>

          {/* Profile */}
          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              background: "#0B79FF",
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            {initial}
          </div>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                right: "1rem",
                top: "3.5rem",
                width: "240px",
                background: "#fff",
                color: "#000",
                borderRadius: "0.5rem",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                zIndex: 1001,
                overflow: "hidden",
                paddingBottom: "0.5rem",
              }}
            >
              <div style={{ padding: "1rem", textAlign: "center" }}>
                <div
                  style={{
                    background: "#0B79FF",
                    width: "3rem",
                    height: "3rem",
                    borderRadius: "50%",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                  }}
                >
                  {initial}
                </div>
                <h6 style={{ margin: "0.5rem 0 0 0" }}>{user.name}</h6>
                <small>{user.email}</small>
              </div>

              <hr style={{ margin: 0 }} />

              {!editOpen && (
                <button
                  onClick={() => {
                    setEditData({ name: user.name, email: user.email, password: "" });
                    setEditOpen(true);
                  }}
                  style={{
                    padding: "0.5rem",
                    border: "none",
                    background: "#4CAF50",
                    color: "#fff",
                    cursor: "pointer",
                    marginTop: "0.3rem",
                  }}
                >
                  Edit Profile
                </button>
              )}

              {editOpen && (
                <div style={{ padding: "0.5rem" }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={editData.name}
                    onChange={handleEditChange}
                    style={{ width: "100%", padding: "0.3rem", marginBottom: "0.3rem" }}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={editData.email}
                    onChange={handleEditChange}
                    style={{ width: "100%", padding: "0.3rem", marginBottom: "0.3rem" }}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={editData.password}
                    onChange={handleEditChange}
                    style={{ width: "100%", padding: "0.3rem", marginBottom: "0.3rem" }}
                  />
                  <button
                    onClick={handleSaveEdit}
                    style={{ width: "100%", padding: "0.4rem", border: "none", background: "#0B79FF", color: "#fff", cursor: "pointer", marginBottom: "0.3rem" }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditOpen(false)}
                    style={{ padding: "0.5rem", border: "none", background: "#696060", color: "#000", cursor: "pointer", borderRadius: "5px" }}
                  >
                    Cancel
                  </button>
                </div>
              )}

              <button
                onClick={handleLogout}
                style={{ margin: ".5rem", padding: "0.5rem", border: "none", background: "#f91a1a", color: "#fff", cursor: "pointer" }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Topbar;