import React, { useState, useEffect } from "react";
import axios from "axios";
import { QrScanner } from "react-qr-scanner"; // compatible with React 18
import "../styles/report.css";

const EquipmentReport = () => {
  const [equipmentName, setEquipmentName] = useState("");
  const [equipmentQuery, setEquipmentQuery] = useState("");
  const [equipmentList, setEquipmentList] = useState([]);
  const [equipmentId, setEquipmentId] = useState("");
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [description, setDescription] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);
  const token = localStorage.getItem("token");

  // Search equipment by name
  useEffect(() => {
    if (!equipmentQuery) {
      setEquipmentList([]);
      return;
    }

    const fetchEquipment = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/equipment?search=${equipmentQuery}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        setEquipmentList(res.data);
      } catch (err) {
        console.error("Failed to fetch equipment:", err.message);
      }
    };

    fetchEquipment();
  }, [equipmentQuery, token]);

  // QR scan handler (fills ID only)
  const handleScan = (result) => {
    if (result) {
      const scannedId = result.text || result;
      setEquipmentId(scannedId);

      // Optional: fetch equipment name automatically
      axios
        .get(`http://localhost:5000/api/equipment/${scannedId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setSelectedEquipment(res.data);
          setEquipmentName(res.data.name);
          setShowQRScanner(false);
        })
        .catch((err) => {
          console.error("Equipment not found:", err.message);
          alert("Equipment not found in database!");
        });
    }
  };

  const handleError = (err) => {
    console.error("QR Scan Error:", err);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!equipmentId || !description) {
      alert("Enter equipment ID and describe the issue");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/equipmentReports",
        {
          equipment: equipmentId,
          description,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      alert("Report submitted! Waiting for manager approval.");
      setEquipmentName("");
      setEquipmentQuery("");
      setEquipmentId("");
      setSelectedEquipment(null);
      setDescription("");
    } catch (err) {
      console.error("Failed to submit report:", err.message);
      alert("Error submitting report");
    }
  };

  return (

    
    <div className="container-fluid py-3">
      <div><h1> <strong>COMING SOON</strong></h1></div>
      <div className="report-equipment-section mb-4 p-3 rounded shadow-sm bg-light">
        <h5>Report Equipment Issue</h5>
        <p className="small text-muted">
          Enter equipment name or scan QR code to fill the ID automatically.
        </p>

        <form onSubmit={handleSubmit}>
          {/* Equipment Name Search */}
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Equipment Name"
              value={equipmentName}
              onChange={(e) => {
                setEquipmentName(e.target.value);
                setEquipmentQuery(e.target.value);
              }}
            />
          </div>

          {/* Name search results */}
          {equipmentList.length > 0 && (
            <div className="mb-2">
              {equipmentList.map((e) => (
                <div
                  key={e._id}
                  className={`p-2 border rounded mb-1 ${
                    selectedEquipment?._id === e._id
                      ? "bg-primary text-white"
                      : "bg-white"
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setSelectedEquipment(e);
                    setEquipmentName(e.name);
                    setEquipmentId(e._id);
                  }}
                >
                  {e.name} ({e._id})
                </div>
              ))}
            </div>
          )}

          {/* Equipment ID input + QR scan */}
          <div className="mb-2 d-flex gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Equipment ID"
              value={equipmentId}
              onChange={(e) => setEquipmentId(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={() => setShowQRScanner((prev) => !prev)}
            >
              {showQRScanner ? "Close QR" : "Scan QR"}
            </button>
          </div>

          {/* QR Scanner */}
          {showQRScanner && (
            <div className="mb-2">
              <QrScanner
                onDecode={handleScan}
                onError={handleError}
                style={{ width: "100%" }}
              />
            </div>
          )}

          {/* Description */}
          <div className="mb-2">
            <textarea
              className="form-control"
              rows="2"
              placeholder="Describe the issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary px-3 btn-sm">
            Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default EquipmentReport;
