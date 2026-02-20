import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/Settings.css";

const Settings = () => {
  const [equipment, setEquipment] = useState([]);
  const [selected, setSelected] = useState(null);
  const [interval, setInterval] = useState("weekly");

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [password, setPassword] = useState("");

  const [autoAssign, setAutoAssign] = useState(true);
  const [qrScanEnabled, setQrScanEnabled] = useState(false);

  useEffect(() => {
    fetchEquipment();
    fetchSettings();
  }, []);

  const fetchEquipment = async () => {
    try {
      const res = await axios.get("/api/equipment");
      setEquipment(res.data);
    } catch {
      setEquipment([
        {
          _id: "1",
          name: "MRI Machine",
          serialNumber: "MRI-7788",
          equipmentID: "EQ-009",
        },
        {
          _id: "2",
          name: "X-Ray Machine",
          serialNumber: "XR-1234",
          equipmentID: "EQ-010",
        },
      ]);
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
      setQrScanEnabled(false);
      setTwoFactorEnabled(false);
    }
  };

  const handleMaintenanceSave = async () => {
    if (!selected) return;
    try {
      await axios.patch(`/api/equipment/${selected._id}/maintenance`, {
        maintenanceInterval: interval,
      });
      alert("Maintenance Scheduled & Task Created");
    } catch {
      alert("Mock: Maintenance Saved");
    }
  };

  const enable2FA = async () => {
    try {
      await axios.patch("/api/users/me/2fa", { password });
      setTwoFactorEnabled(true);
      setShow2FASetup(false);
      alert("2FA Enabled Successfully");
    } catch {
      alert("Mock 2FA Enabled");
    }
  };

  const toggleAutoAssign = async () => {
    setAutoAssign(!autoAssign);
    try {
      await axios.patch("/api/settings/auto-assign", {
        autoAssignTechnician: !autoAssign,
      });
    } catch {}
  };

  const toggleQrScan = async () => {
    setQrScanEnabled(!qrScanEnabled);
    try {
      await axios.patch("/api/settings/qr-scan", {
        qrScanEnabled: !qrScanEnabled,
      });
    } catch {}
  };

  function toggle2FA() {
    const box = document.getElementById("twofaBox");
    box.style.display = box.style.display === "flex" ? "none" : "flex";
  }
  return (
    <div className="settings-page">
      {/* Maintenance Schedule */}
      <h2 className="section-divider">Maintenance</h2>
      <div className="card-grid">
        <div className="card">
          <h3>Maintenance Schedule</h3>

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

        {/* Auto-Assign Technician */}
        <div className="card">
          <h3>Automatic Assignment</h3>
          <div className="auto-assign-control">
            <span>Assign Technician Automatically</span>
            <div
              className={`toggle-switch ${autoAssign ? "active" : ""}`}
              onClick={toggleAutoAssign}
            >
              <div className="toggle-circle"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Security */}
      <h2 className="section-divider">Security</h2>
      <div className="card-grid">
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
            <p className="enabled">2FA is Enabled ✔</p>
          )}
        </div>

        {/* QR Scan */}
        <div className="card">
          <h3>QR Scan Permission</h3>
          <div className="auto-assign-control">
            <span>Require QR Scan for Equipment</span>
            <div
              className={`toggle-switch ${qrScanEnabled ? "active" : ""}`}
              onClick={toggleQrScan}
            >
              <div className="toggle-circle"></div>
            </div>
          </div>
          <p className="mt-2 text-muted">
            When enabled, equipment must be scanned before processing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
