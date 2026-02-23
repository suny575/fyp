import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/EditProfile.css";


const EditProfile = () => {
  const navigate = useNavigate();

  // Initial values (can be replaced with API data)
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState("/profile-placeholder.png");

  // Simulate fetching admin data from backend
  useEffect(() => {
    // Replace this with API call
    const adminData = {
      name: "Admin Name",
      email: "admin@example.com",
      profilePic: "/profile-placeholder.png",
    };

    setName(adminData.name);
    setEmail(adminData.email);
    setPreviewPic(adminData.profilePic);
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);

    // Preview new image
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewPic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Call backend API to save changes
    console.log({ name, email, password, profilePic });
    alert("Profile updated successfully!");
    navigate("/admin/edit-profile");
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit} className="edit-profile-form">
        {/* Profile Picture */}
        <div className="profile-pic-section">
          <img src={previewPic} alt="Profile" className="avatar-preview" />
          <input type="file" onChange={handleProfilePicChange} />
        </div>

        {/* Name */}
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        {/* Email */}
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        {/* Password */}
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
        </label>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditProfile;