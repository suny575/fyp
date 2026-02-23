
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Topbar.css";


const Topbar = () => {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth");
  };

  const toggleProfile = () => {
    setProfileOpen(!profileOpen);
  };

  const [notifOpen, setNotifOpen] = useState(false);

const toggleNotifications = () => {
  setNotifOpen(!notifOpen);
};


  return (
    <div className="topbar">
      <div className="topbar-bottom">
        <span><h4>Welcome to Admin Dashboard</h4></span>

        <div className="topbar-actions">

          {/* Notifications */}
   <div className="notification-icon" onClick={toggleNotifications}>
  <span role="img" aria-label="bell">🔔</span>
  <span className="notification-count">3</span>

  {notifOpen && (
    <div className="notification-dropdown">
      <h4>Notifications</h4>
      <ul>
        <li>New equipment request submitted</li>
        <li>Maintenance completed for device </li>
        <li>Admin message: Update your profile</li>
      </ul>
    </div>
  )}
</div>


          {/* Profile Dropdown */}
          <div className="profile-container">
            <div className="profile-avatar" onClick={toggleProfile}>
              {/* Replace with admin profile image if available */}
              <img
                src="/profile-placeholder.png"
                alt="Admin"
                className="avatar"
              />
            </div>

            {profileOpen && (
              <div className="profile-dropdown">
                <div className="profile-info">
                  <img
                    src="/profile-placeholder.png"
                    alt="Admin"
                    className="avatar-large"
                  />
                  <div>
                    <h4>Admin Name</h4>
                    <p>admin@example.com</p>
                  </div>
                </div>

                <div className="profile-actions">
                  <button onClick={() => navigate("/admin/edit-profile")}>
                    Edit Profile
                  </button>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
























