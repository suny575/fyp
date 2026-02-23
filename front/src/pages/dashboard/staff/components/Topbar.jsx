import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

const Topbar = ({ user = {}, toggleSidebar, goToNotifications }) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(user?.photo || null);
  const profileRef = useRef(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const handleNotificationClick = () => {
    if (goToNotifications) goToNotifications();
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setProfilePhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="topbar d-flex justify-content-between align-items-center px-4 shadow-sm">
      <button
        className="btn btn-outline-primary d-lg-none"
        onClick={toggleSidebar}
      >
        ☰
      </button>

      <div></div>

      <div className="d-flex align-items-center gap-3">
        {/* Notifications */}
        <div className="position-relative">
          <button
            className="btn btn-outline-secondary"
            onClick={handleNotificationClick}
          >
            🔔
          </button>
          {user?.notificationCount > 0 && (
            <span className="badge bg-danger notification-badge">
              {user.notificationCount}
            </span>
          )}
        </div>

        {/* Profile */}
        <div className="position-relative" ref={profileRef}>
          <div
            className="profile-avatar"
            onClick={(e) => {
              e.stopPropagation();
              setShowProfile(!showProfile);
            }}
          >
            {profilePhoto ? (
              <img src={profilePhoto} alt="profile" />
            ) : (
              <span>{initial}</span>
            )}
          </div>

          {showProfile && (
            <div className="profile-dropdown show shadow">
              <div className="profile-header text-center">
                <div className="profile-avatar large">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="profile" />
                  ) : (
                    <span>{initial}</span>
                  )}
                </div>
                <h6 className="mt-2 mb-1">{user.name}</h6>
                <small className="text-muted">{user.phone || "No Phone"}</small>
              </div>

              <hr />

              {!editing ? (
                <>
                  <button
                    className="btn btn-edit w-100 mb-2"
                    onClick={() => setEditing(true)}
                  >
                    Edit Profile
                  </button>
                  <button
                    className="btn btn-logout text-danger w-100"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="px-3 pb-3">
                  <div className="mb-2 text-center">
                    <label className="btn btn-outline-secondary btn-sm w-100">
                      Change Photo
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handlePhotoChange}
                      />
                    </label>
                  </div>

                  <input
                    type="text"
                    className="form-control mb-2"
                    defaultValue={user.name}
                    placeholder="Full Name"
                  />
                  <input
                    type="email"
                    className="form-control mb-2"
                    defaultValue={user.email}
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    defaultValue={user.username}
                    placeholder="Username"
                  />

                  <button
                    className="btn btn-primary btn-sm w-100"
                    onClick={() => setEditing(false)}
                  >
                    Save Changes
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
