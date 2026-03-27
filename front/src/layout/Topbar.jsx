import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../components/notifications/NotificationBell";
import { useAuth } from "../context/AuthContext";

const API_BASE_URL = "http://localhost:5000";

const getProfileImageUrl = (profileImage) => {
  if (!profileImage) return "";
  if (profileImage.startsWith("http")) return profileImage;
  return `${API_BASE_URL}${profileImage}`;
};

const Topbar = ({ toggleSidebar, isDesktop }) => {
  const { user, token, logout, updateUser } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const wrapperRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setDropdownOpen(false);
        setEditOpen(false);
        setSelectedImage(null);
        setPreviewUrl("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const closeEditPanel = () => {
    setEditOpen(false);
    setSelectedImage(null);
    setPreviewUrl("");
  };

  const handleOpenEdit = () => {
    setEditData({
      name: user?.name || "",
      email: user?.email || "",
      password: "",
    });
    setEditOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSaveEdit = async () => {
    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", editData.name.trim());
      formData.append("email", editData.email.trim());

      if (editData.password.trim()) {
        formData.append("password", editData.password.trim());
      }

      if (selectedImage) {
        formData.append("profileImage", selectedImage);
      }

      const res = await axios.put(`${API_BASE_URL}/api/profile`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      updateUser(res.data.user);
      alert("Profile updated!");
      closeEditPanel();
      setDropdownOpen(false);
    } catch (err) {
      console.error("Failed to update profile:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Update failed!");
    } finally {
      setSaving(false);
    }
  };

  const initial = user?.name?.charAt(0).toUpperCase() || "U";
  const avatarSrc = previewUrl || getProfileImageUrl(user?.profileImage);
  const profileButtonLabel = avatarSrc ? "Change Profile" : "Set Profile";

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
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {!isDesktop && (
          <button
            onClick={toggleSidebar}
            style={{
              fontSize: "1rem",
              background: "transparent",
              border: "none",
              color: "#3312ef",
              cursor: "pointer",
            }}
          >
            Menu
          </button>
        )}
      </div>

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
          <NotificationBell />

          <div
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              fontWeight: "bold",
              overflow: "hidden",
              background: avatarSrc ? "#fff" : "#0B79FF",
              border: "2px solid #0B79FF",
              color: "#fff",
            }}
          >
            {avatarSrc ? (
              <img
                src={avatarSrc}
                alt={`${user.name} profile`}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              initial
            )}
          </div>

          {dropdownOpen && (
            <div
              style={{
                position: "absolute",
                right: "1rem",
                top: "3.5rem",
                width: "260px",
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
                    width: "3.5rem",
                    height: "3.5rem",
                    borderRadius: "50%",
                    margin: "0 auto",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "#fff",
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    overflow: "hidden",
                    background: avatarSrc ? "#fff" : "#0B79FF",
                    border: "2px solid #0B79FF",
                  }}
                >
                  {avatarSrc ? (
                    <img
                      src={avatarSrc}
                      alt={`${user.name} profile`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    initial
                  )}
                </div>
                <h6 style={{ margin: "0.5rem 0 0 0" }}>{user.name}</h6>
                <small>{user.email}</small>
              </div>

              <hr style={{ margin: 0 }} />

              {!editOpen && (
                <button
                  onClick={handleOpenEdit}
                  style={{
                    padding: "0.5rem",
                    border: "none",
                    background: "#4CAF50",
                    color: "#fff",
                    cursor: "pointer",
                    marginTop: "0.3rem",
                    marginLeft: "0.5rem",
                    borderRadius: "6px",
                  }}
                >
                  Edit Profile
                </button>
              )}

              {editOpen && (
                <div style={{ padding: "0.5rem" }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: "none" }}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: "1px solid #0B79FF",
                      background: "#f4f8ff",
                      color: "#0B79FF",
                      cursor: "pointer",
                      borderRadius: "6px",
                      marginBottom: "0.5rem",
                    }}
                  >
                    {profileButtonLabel}
                  </button>
                  {selectedImage && (
                    <p
                      style={{
                        fontSize: "12px",
                        color: "#555",
                        margin: "0 0 0.5rem 0",
                      }}
                    >
                      Selected: {selectedImage.name}
                    </p>
                  )}
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={editData.name}
                    onChange={handleEditChange}
                    style={{
                      width: "100%",
                      padding: "0.3rem",
                      marginBottom: "0.3rem",
                    }}
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={editData.email}
                    onChange={handleEditChange}
                    style={{
                      width: "100%",
                      padding: "0.3rem",
                      marginBottom: "0.3rem",
                    }}
                  />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={editData.password}
                    onChange={handleEditChange}
                    style={{
                      width: "100%",
                      padding: "0.3rem",
                      marginBottom: "0.3rem",
                    }}
                  />
                  <button
                    onClick={handleSaveEdit}
                    style={{
                      width: "100%",
                      padding: "0.4rem",
                      border: "none",
                      background: "#0B79FF",
                      color: "#fff",
                      cursor: "pointer",
                      marginBottom: "0.3rem",
                      opacity: saving ? 0.7 : 1,
                    }}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={closeEditPanel}
                    style={{
                      padding: "0.5rem",
                      border: "none",
                      background: "#696060",
                      color: "#fff",
                      cursor: "pointer",
                      borderRadius: "5px",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}

              <button
                onClick={handleLogout}
                style={{
                  margin: ".5rem",
                  padding: "0.5rem",
                  border: "none",
                  background: "#f91a1a",
                  color: "#fff",
                  cursor: "pointer",
                  borderRadius: "6px",
                }}
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
