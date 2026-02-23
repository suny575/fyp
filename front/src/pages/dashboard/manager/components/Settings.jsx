import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Settings.css";

const Settings = () => {
  const [equipment, setEquipment] = useState([]);
  const [scheduledList, setScheduledList] = useState([]);

  const [selected, setSelected] = useState(null);
  const [interval, setInterval] = useState("weekly");

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [password, setPassword] = useState("");

  const [autoAssign, setAutoAssign] = useState(true);
  const [qrScanEnabled, setQrScanEnabled] = useState(true);

  useEffect(() => {
    fetchEquipment();
    fetchSettings();
    fetchScheduled();
  }, []);

  // ---------------- FETCH DATA ----------------

  const fetchEquipment = async () => {
    try {
      const res = await axios.get("/api/equipment");
      setEquipment(res.data);
    } catch {
      setEquipment([]);
    }
  };

  const fetchScheduled = async () => {
    try {
      const res = await axios.get("/api/scheduledMaintenance");
      setScheduledList(res.data);
    } catch {
      setScheduledList([]);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await axios.get("/api/settings");
      setAutoAssign(res.data.autoAssignTechnician);
      setQrScanEnabled(res.data.qrScanEnabled);
      setTwoFactorEnabled(res.data.twoFactorEnabled);
    } catch {
      setAutoAssign(true);
      setQrScanEnabled(true);
    }
  };

  // ---------------- MAINTENANCE ----------------

  const handleMaintenanceSave = async () => {
    if (!selected) return alert("Select equipment first");

    try {
      await axios.patch(`/api/equipment/${selected._id}/maintenance`, {
        maintenanceInterval: interval,
      });

      alert("Maintenance Scheduled ✔ Technician & Manager Notified");
      fetchScheduled();
    } catch {
      alert("Failed to schedule maintenance");
    }
  };

  // ---------------- SECURITY ----------------

  const enable2FA = async () => {
    try {
      await axios.patch("/api/users/me/2fa", { password });
      setTwoFactorEnabled(true);
      setShow2FASetup(false);
      alert("2FA Enabled Successfully");
    } catch {
      alert("Error enabling 2FA");
    }
  };

  // ---------------- SETTINGS TOGGLES ----------------

  const toggleAutoAssign = async () => {
    const newValue = !autoAssign;
    setAutoAssign(newValue);

    await axios.patch("/api/settings/auto-assign", {
      autoAssignTechnician: newValue,
    });
  };

  const toggleQrScan = async () => {
    const newValue = !qrScanEnabled;
    setQrScanEnabled(newValue);

    await axios.patch("/api/settings/qr-scan", {
      qrScanEnabled: newValue,
    });
  };

  // ---------------- UI ----------------

  return (
    <div className="settings-page">
      {/* ========== MAINTENANCE SECTION ========== */}
      <h2 className="section-divider">Maintenance Management</h2>

      <div className="card-grid">
        {/* Schedule Maintenance */}
        <div className="card">
          <h3>Schedule Maintenance</h3>

          <select
            onChange={(e) =>
              setSelected(equipment.find((eq) => eq._id === e.target.value))
            }
          >
            <option>Select Equipment</option>
            {equipment.map((eq) => (
              <option key={eq._id} value={eq._id}>
                {eq.name}
              </option>
            ))}
          </select>

          {selected && (
            <>
              <div className="equipment-info">
                <p>
                  <strong>Serial:</strong> {selected.serialNumber}
                </p>
                <p>
                  <strong>ID:</strong> {selected.equipmentID}
                </p>
              </div>

              <select
                value={interval}
                onChange={(e) => setInterval(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>

              <button
                className="btn btn-primary mt-2"
                onClick={handleMaintenanceSave}
              >
                Save Maintenance
              </button>
            </>
          )}
        </div>

        {/* Auto Assign */}
        <div className="card">
          <h3>Automatic Assignment</h3>
          <div className="auto-assign-control">
            <span>Auto Assign Technician</span>
            <div
              className={`toggle-switch ${autoAssign ? "active" : ""}`}
              onClick={toggleAutoAssign}
            >
              <div className="toggle-circle"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scheduled Maintenance List */}
      <div className="scheduled-wrapper">
        <h4>Upcoming Scheduled Maintenance</h4>

        <div className="scheduled-grid">
          {scheduledList.length === 0 && (
            <p className="text-muted">No scheduled maintenance found.</p>
          )}

          {scheduledList.map((item) => (
            <div key={item._id} className="scheduled-card">
              <h5>{item.equipment?.name}</h5>
              <p>
                <strong>Interval:</strong> {item.interval}
              </p>
              <p>
                <strong>Next Date:</strong>{" "}
                {new Date(item.nextDate).toLocaleDateString()}
              </p>
              <span className="badge bg-warning text-dark">{item.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ========== SECURITY SECTION ========== */}
      <h2 className="section-divider">Security & Permissions</h2>

      <div className="card-grid">
        {/* 2FA */}
        <div className="card">
          <h3>Two-Factor Authentication</h3>

          {!twoFactorEnabled ? (
            <>
              <button
                className="btn btn-warning mb-2"
                onClick={() => setShow2FASetup(true)}
              >
                Enable 2FA
              </button>

              {show2FASetup && (
                <div className="twofa-setup">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button className="btn btn-success mt-1" onClick={enable2FA}>
                    Confirm & Activate
                  </button>
                </div>
              )}
            </>
          ) : (
            <p className="enabled">2FA Enabled ✔</p>
          )}
        </div>

        {/* QR Permission */}
        <div className="card">
          <h3>QR Scan Permission</h3>
          <div className="auto-assign-control">
            <span>Allow Equipment QR Scanning</span>
            <div
              className={`toggle-switch ${qrScanEnabled ? "active" : ""}`}
              onClick={toggleQrScan}
            >
              <div className="toggle-circle"></div>
            </div>
          </div>
          <p className="mt-2 textb text-muted">
            If disabled, department staff must request manager approval before
            scanning.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
