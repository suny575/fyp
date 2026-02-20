import React from "react";
import { FaBars, FaBell, FaFileAlt } from "react-icons/fa";
import "../styles/Topbar.css";

const Topbar = ({
  toggleSidebar,
  profileOpen,
  toggleProfile,
  notificationOpen,
  toggleNotification,
}) => {
  const manager = {
    firstName: "John",
    fullName: "John Doe",
    email: "john@example.com",
    phone: "123456789",
  };

  return (
    <div className="topbar">
      <div className="left-section">
        <FaBars className="hamburger d-lg-none" onClick={toggleSidebar} />
        <span className="welcome-text">Welcome, {manager.firstName}</span>
      </div>

      <div className="right-section">
        <FaBell className="icon" onClick={toggleNotification} />
        <FaFileAlt className="icon" />

        <div className="profile-container">
          <div className="profile-circle" onClick={toggleProfile}>
            {manager.firstName.charAt(0)}
          </div>

          {profileOpen && (
            <div className="profile-dropdown">
              <p className="fw-bold">{manager.fullName}</p>
              <small>{manager.email}</small>
              <small>{manager.phone}</small>
              <hr />
              <button className="btn btn-sm btn-primary w-100">
                Edit Profile
              </button>
              <button className="btn btn-sm btn-outline-danger w-100 mt-2">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Topbar;
