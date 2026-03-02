import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import { Card, Button, Form, Badge, Spinner } from "react-bootstrap";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

const Faults = () => {
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState({
    equipment: "",
    department: "",
    priority: "medium",
    description: "",
  });

  const [equipments, setEquipments] = useState([]);
  const [equipmentsLoading, setEquipmentsLoading] = useState(true);

  const [images, setImages] = useState([]);
  const [audioURL, setAudioURL] = useState(null);
  const [voiceFile, setVoiceFile] = useState(null);
  const [recording, setRecording] = useState(false);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  const [faults, setFaults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFaults, setShowFaults] = useState(false);
  const [filter, setFilter] = useState("all");

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const highlightId = queryParams.get("highlight");

  // ===== Handle Form Change =====
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "equipment") {
      const selectedEquipment = equipments.find((eq) => eq._id === value);

      setFormData({
        ...formData,
        equipment: value,
        department: selectedEquipment?.department || "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleImageChange = (e) => {
    setImages((prev) => [...prev, ...Array.from(e.target.files)]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ===== Fetch Equipment =====
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/equipment", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEquipments(res.data);
      } catch (err) {
        console.error("Error fetching equipment:", err);
      } finally {
        setEquipmentsLoading(false);
      }
    };
    fetchEquipments();
  }, [token]);

  // ===== Recording Logic =====
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        setVoiceFile(blob);

        // Stop mic completely
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Microphone access denied:", err);
      alert("Microphone permission is required for voice recording.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const removeVoice = () => {
    setVoiceFile(null);
    setAudioURL(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.equipment || !formData.description) {
      alert("Please fill in all required fields!");
      return;
    }

    const submitData = new FormData();
    submitData.append("equipment", formData.equipment);
    submitData.append("priority", formData.priority);
    submitData.append("description", formData.description);

    images.forEach((img) => submitData.append("images", img)); // optional
    if (voiceFile) submitData.append("voiceNote", voiceFile); // optional

    try {
      const res = await axios.post(
        "http://localhost:5000/api/faults",
        submitData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            // DO NOT set Content-Type manually! Browser handles it for FormData
          },
        },
      );

      // Reset form & show feedback
      setFormData({ equipment: "", priority: "medium", description: "" });
      setImages([]);
      setAudioURL(null);
      setVoiceFile(null);
      setFaults((prev) => [res.data.fault, ...prev]);
      alert("✅ Fault submitted successfully!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit fault");
    }
  };

  // ===== Fetch Faults =====
  const fetchFaults = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/faults", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFaults(res.data);
    } catch (err) {
      console.error("Error fetching faults:", err);
    } finally {
      setLoading(false);
    }
  };

  // ===== Socket =====
  useEffect(() => {
    socket.connect();
    socket.on("faultCreated", (newFault) =>
      setFaults((prev) => [newFault, ...prev]),
    );
    socket.on("faultUpdated", (updatedFault) =>
      setFaults((prev) =>
        prev.map((f) => (f._id === updatedFault._id ? updatedFault : f)),
      ),
    );
    return () => socket.disconnect();
  }, []);

  const filteredFaults =
    filter === "all" ? faults : faults.filter((f) => f.status === filter);

  const getBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-warning text-dark";
      case "in-progress":
        return "bg-primary";
      case "completed":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="p-4">
      <h3 className="fw-bold mb-4">Submit Equipment Fault</h3>

      <Card className="shadow-sm mb-4 border-0">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="my-5">
              <Form.Label>Equipment</Form.Label>
              <Form.Select
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                required
              >
                <option value="">
                  {equipmentsLoading
                    ? "Loading equipment..."
                    : "Choose equipment"}
                </option>
                {equipments.map((eq) => (
                  <option key={eq._id} value={eq._id}>
                    {eq.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group style={{ flex: "1 1 200px" }}>
              <Form.Label>Department</Form.Label>
              <Form.Control
                type="text"
                name="department"
                value={formData.department}
                readOnly
                required
                style={{ width: "100%", padding: "8px" }}
              />
            </Form.Group>

            <Form.Group className="my-5">
              <Form.Label>Priority</Form.Label>
              <Form.Select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Describe the issue..."
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Attach Images</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />

              {images.length > 0 && (
                <div className="d-flex flex-wrap gap-2 mt-2">
                  {images.map((img, idx) => (
                    <div
                      key={idx}
                      style={{
                        position: "relative",
                        width: "100px",
                        height: "100px",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="img-thumbnail"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />

                      {/* ❌ Delete Button */}
                      <span
                        onClick={() => removeImage(idx)}
                        style={{
                          position: "absolute",
                          top: "2px",
                          right: "6px",
                          cursor: "pointer",
                          background: "rgba(0,0,0,0.6)",
                          color: "white",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "14px",
                        }}
                      >
                        ✕
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Voice Note</Form.Label>
              <div className="d-flex align-items-center gap-2">
                {!recording ? (
                  <Button variant="outline-danger" onClick={startRecording}>
                    🎙 Start Recording
                  </Button>
                ) : (
                  <Button variant="danger" onClick={stopRecording}>
                    ⏹ Stop Recording
                  </Button>
                )}

                {audioURL && (
                  <div
                    className="d-flex align-items-center gap-2"
                    style={{ position: "relative" }}
                  >
                    <audio controls src={audioURL} />

                    <i
                      className="bi bi-trash"
                      onClick={removeVoice}
                      style={{
                        cursor: "pointer",
                        fontSize: "18px",
                        color: "#dc3545",
                      }}
                      title="Delete voice note"
                    />
                  </div>
                )}
              </div>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button type="submit" variant="primary">
                Submit Report
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <div className="mb-3">
        <Button
          variant="secondary"
          onClick={() => {
            fetchFaults();
            setShowFaults(!showFaults);
          }}
        >
          {showFaults ? "Hide Reported Faults" : "Show Reported Faults"}
        </Button>
      </div>

      {/* ===== Faults Display: Table for large, Cards for small ===== */}
      {showFaults && (
        <>
          <div className="d-none d-lg-block">
            <Card className="shadow-sm border-0">
              <Card.Body>
                {loading ? (
                  <Spinner animation="border" />
                ) : (
                  <div className="table-responsive">
                    <table className="table mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Equipment</th>
                          <th>Status</th>
                          <th>Priority</th>
                          <th>Reported By</th>
                          <th>Assigned To</th>
                          <th>Date</th>
                          <th>Updated By</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredFaults.map((f) => (
                          <tr
                            key={f._id}
                            className={
                              f._id === highlightId ? "table-info" : ""
                            }
                          >
                            <td>{f.equipment?.name || "Unknown"}</td>
                            <td>
                              <Badge className={getBadge(f.status)}>
                                {f.status}
                              </Badge>
                            </td>
                            <td>{f.priority}</td>
                            <td>{f.reportedBy?.name || "Unknown"}</td>
                            <td>{f.assignedTo?.name || "Not Assigned"}</td>
                            <td>
                              {new Date(f.createdAt).toLocaleDateString()}
                            </td>
                            <td>
                              {["pending", "waiting"].includes(f.status)
                                ? "-"
                                : f.updatedBy || "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>

          <div className="d-block d-lg-none">
            {filteredFaults.map((f) => (
              <Card key={f._id} className="mb-3 shadow-sm">
                <Card.Body>
                  <Card.Title>{f.equipment?.name || "Unknown"}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Reported by: {f.reportedBy?.name || "Unknown"}
                  </Card.Subtitle>
                  <Card.Text>
                    Status:{" "}
                    <Badge className={getBadge(f.status)}>{f.status}</Badge>
                    <br />
                    Priority: {f.priority}
                    <br />
                    Assigned To: {f.assignedTo?.name || "Not Assigned"}
                    <br />
                    Updated By:{" "}
                    {["pending", "waiting"].includes(f.status)
                      ? "-"
                      : f.updatedBy || "-"}
                  </Card.Text>
                  <Card.Text>{f.description}</Card.Text>
                </Card.Body>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Faults;
