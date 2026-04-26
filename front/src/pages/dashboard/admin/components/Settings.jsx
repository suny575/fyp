

import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Settings.css";
import { getStoredToken } from "../../../../utils/authStorage.js";

const Settings = () => {
  const defaultSettings = {
    autoRestart: false,
    maxLoginAttempts: 5,
    minPasswordLength: 8,
    requireStrongPassword: true,
    inAppNotifications: true,
    soundAlert: false,
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [savedMessage, setSavedMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const token = getStoredToken();

  // Fetch settings from backend on load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get("https://fyp-dle0.onrender.com/api/admin/settings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data) setSettings(res.data);
      } catch (err) {
        console.error("Error fetching settings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleToggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (e) => {
    setSettings((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        "https://fyp-dle0.onrender.com/api/admin/settings",
        settings,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setSavedMessage("Settings saved successfully ✅");
      setTimeout(() => setSavedMessage(""), 3000);
    } catch (err) {
      console.error("Error saving settings:", err);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

  if (loading) return <p>Loading settings...</p>;

  return (
    <div className="settings-container">
      <h2>System Settings</h2>
      {savedMessage && <div className="success-message">{savedMessage}</div>}

      <div className="settings-grid">
        {/* Security Settings */}
        <div className="settings-card">
          <h3>🔐 Security Settings</h3>
          <p>Control system protection and monitoring options.</p>

          <div className="setting-item">
            <span>Auto Restart on Crash</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.autoRestart}
                onChange={() => handleToggle("autoRestart")}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <span>Max Failed Login Attempts</span>
            <input
              type="number"
              name="maxLoginAttempts"
              value={settings.maxLoginAttempts}
              onChange={handleChange}
              className="number-input"
            />
          </div>

          <div className="setting-item">
            <span>Minimum Password Length</span>
            <input
              type="number"
              name="minPasswordLength"
              value={settings.minPasswordLength}
              onChange={handleChange}
              className="number-input"
            />
          </div>

          <div className="setting-item">
            <span>Require Strong Password</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.requireStrongPassword}
                onChange={() => handleToggle("requireStrongPassword")}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

      </div>

      {/* Bottom Buttons */}
      <div className="settings-actions">
        <button className="reset-btn" onClick={handleReset}>
          Reset to Default
        </button>

        <button className="save-btn" onClick={handleSave}>
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;

