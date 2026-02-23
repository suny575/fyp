import React, { useState } from "react";
import "../styles/Settings.css";


const Settings = () => {
  const defaultSettings = {
    enableSystemAlerts: true,
    enableCriticalAlerts: true,
    autoRestart: false,
    loginMonitoring: true,
    maxLoginAttempts: 5,
    minPasswordLength: 8,
   requireStrongPassword: true,
   sessionTimeout: 30,

    defaultManagerStatus: "Active",
    requireEmailVerification: true,
    sendWelcomeEmail: true,
    emailNotifications: true,
    inAppNotifications: true,
    soundAlert: false,
  };

  const [settings, setSettings] = useState(defaultSettings);
  const [savedMessage, setSavedMessage] = useState("");

  const handleToggle = (key) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = () => {
    setSavedMessage("Settings saved successfully ✅");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  const handleReset = () => {
    setSettings(defaultSettings);
  };

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
            <span>Enable Critical Alerts</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.enableCriticalAlerts}
                onChange={() => handleToggle("enableCriticalAlerts")}
              />
              <span className="slider"></span>
            </label>
          </div>

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

<div className="setting-item">
  <span>Session Timeout (minutes)</span>
  <input
    type="number"
    name="sessionTimeout"
    value={settings.sessionTimeout}
    onChange={handleChange}
    className="number-input"
  />
</div>


        </div>

        {/* Manager Registration Settings */}
        <div className="settings-card">
          <h3>👤 Manager Registration</h3>
          <p>Configure how new maintenance managers are created.</p>

          <div className="setting-item">
            <span>Default Manager Status</span>
            <select
              name="defaultManagerStatus"
              value={settings.defaultManagerStatus}
              onChange={handleChange}
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="setting-item">
            <span>Require Email Verification</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.requireEmailVerification}
                onChange={() => handleToggle("requireEmailVerification")}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <span>Send Welcome Email</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.sendWelcomeEmail}
                onChange={() => handleToggle("sendWelcomeEmail")}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="settings-card">
          <h3>🔔 Notification Preferences</h3>
          <p>Choose how admin receives alerts and notifications.</p>

          <div className="setting-item">
            <span>Email Notifications</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.emailNotifications}
                onChange={() => handleToggle("emailNotifications")}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <span>In-App Notifications</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.inAppNotifications}
                onChange={() => handleToggle("inAppNotifications")}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <span>Enable Sound Alert</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.soundAlert}
                onChange={() => handleToggle("soundAlert")}
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
