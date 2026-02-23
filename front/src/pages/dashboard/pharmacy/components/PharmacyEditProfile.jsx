// PharmacyEditProfile.jsx
import React, { useState, useEffect } from "react";
import "../styles/PharmacyEditProfile.css";

const PharmacyEditProfile = () => {
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [previewPic, setPreviewPic] = useState("/profile-placeholder.png");

  // Simulate fetching pharmacy user data
  useEffect(() => {
    const userData = {
      name: "Pharmacy User",
      email: "pharmacy@example.com",
      profilePic: "/profile-placeholder.png",
    };

    setName(userData.name);
    setEmail(userData.email);
    setPreviewPic(userData.profilePic);
  }, []);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPreviewPic(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Send updated data to backend
    console.log({ name, email, password, profilePic });
    alert("Profile updated successfully!");
  };

  return (
    <div className="pharmacy-edit-profile-container">
      <h2>Edit Profile</h2>

      <form onSubmit={handleSubmit} className="pharmacy-edit-profile-form">
        <div className="profile-pic-section">
          <img src={previewPic} alt="Profile" className="avatar-preview" />
          <input type="file" onChange={handleProfilePicChange} />
        </div>

        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

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

export default PharmacyEditProfile;