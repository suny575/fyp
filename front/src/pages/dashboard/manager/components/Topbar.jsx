import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBell, FaFileAlt } from "react-icons/fa";
import "../styles/Topbar.css";

const Topbar = ({ toggleSidebar, sidebarOpen, manager }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileData, setProfileData] = useState(manager || {});
  const wrapperRef = useRef(null);

  const navigate = useNavigate();
  const notificationCount = 3;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setEditMode(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    console.log("Logging out...");
    window.location.href = "/auth";
  };

  const handleProfileUpdate = () => {
    console.log("Updated profile:", profileData);
    setEditMode(false);
    setDropdownOpen(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const imageUrl = URL.createObjectURL(file);
    setProfileData({
      ...profileData,
      avatar: imageUrl,
      avatarFile: file,
    });
  };

  return (
    <div
      className="d-flex justify-content-between align-items-center px-3 td-wrapper"
      style={{
        height: "60px",
        background: "#fff",
        borderBottom: "1px solid #e5e5e5",
        position: "relative",
        zIndex: 10,
      }}
    >
      {/* Left side */}
      <div className="d-flex align-items-center">
        <button
          className="btn btn-light d-md-none me-3"
          onClick={toggleSidebar}
        >
          ☰
        </button>
        <h5 className="mb-0 fw-semibold">Manager Dashboard</h5>
      </div>

      {/* Right side */}
      <div className="d-flex align-items-center gap-3">
        {/* Notifications */}
        <div className="position-relative">
          <button
            className="btn btn-light position-relative"
            onClick={() => navigate("/manager/notifications")}
          >
            <FaBell />
            {notificationCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "5px",
                  right: "5px",
                  background: "red",
                  color: "white",
                  borderRadius: "50%",
                  fontSize: "12px",
                  width: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {notificationCount}
              </span>
            )}
          </button>
        </div>

        {/* Reports */}
        <button
          className="btn btn-light"
          onClick={() => navigate("/manager/reports")}
        >
          <FaFileAlt />
        </button>

        {/* Profile */}
        <div className="position-relative" ref={wrapperRef}>
          <div
            onClick={(e) => {
              e.stopPropagation();
              setDropdownOpen((prev) => !prev);
            }}
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#0d6efd",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontWeight: "600",
              userSelect: "none",
            }}
          >
            {profileData?.firstName?.charAt(0)?.toUpperCase() || "U"}
          </div>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              className="dropdown"
              style={{
                position: "absolute",
                top: "60px",
                right: "0",
                width: "290px",
                padding: "12px 0",
                background: "rgba(255,255,255,0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: "14px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                border: "1px solid rgba(255,255,255,0.4)",
                zIndex: 1000,
              }}
            >
              {!editMode ? (
                <>
                  <div className="text-center p-3 border-bottom">
                    <div
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "50%",
                        background: "#0d6efd",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 10px",
                        fontSize: "20px",
                        fontWeight: "bold",
                      }}
                    >
                      {profileData?.firstName?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    <h6 className="mb-1">{profileData?.firstName}</h6>
                    <small className="text-muted">{profileData?.phone}</small>
                  </div>

                  <button
                    className="dropdown-item1"
                    onClick={() => setEditMode(true)}
                  >
                    Edit profile
                  </button>
                  <br />
                  <button className="dropdown-item2" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <div className="p-3">
                  <input
                    className="form-control mb-2"
                    placeholder="Name"
                    value={profileData?.firstName || ""}
                    onChange={(e) =>
                      setProfileData({
                        ...profileData,
                        firstName: e.target.value,
                      })
                    }
                  />
                  <input
                    className="form-control mb-2"
                    placeholder="Phone"
                    value={profileData?.phone || ""}
                    onChange={(e) =>
                      setProfileData({ ...profileData, phone: e.target.value })
                    }
                  />

                  <div className="profile-upload">
                    <label className="profile-upload-btn">
                      {profileData?.avatar ? "Change Profile" : "Set Profile"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>

                  <button
                    className="btn btn-primary w-100 mb-2"
                    onClick={handleProfileUpdate}
                  >
                    Save Changes
                  </button>
                  <button
                    className="btn btn-secondary w-100"
                    onClick={() => setEditMode(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
