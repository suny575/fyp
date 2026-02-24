import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Form, Button, Alert, Spinner, Table } from "react-bootstrap";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  autoConnect: false, // don’t connect automatically if backend is down
});

const TechnicianManagement = () => {
  const [technicians, setTechnicians] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [role, setRole] = useState("technician"); // preset role

  const token = localStorage.getItem("token");

  // -------------------
  // Mocked fetch technicians
  // -------------------
  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      if (!token) throw new Error("No token");

      const res = await axios.get("http://localhost:5000/api/technicians", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTechnicians(res.data);
    } catch (err) {
      console.error("Error fetching technicians, using mock data:", err);
      setError("Backend not reachable, showing mock data for now");

      // Mock data fallback
      setTechnicians([
        {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "technician",
        },
        {
          id: "2",
          name: "Jane Smith",
          email: "jane@example.com",
          role: "technician",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();

    // Safe Socket.IO connection
    try {
      socket.connect();
      socket.on("connect", () => console.log("Socket connected:", socket.id));
      socket.on("disconnect", () => console.log("Socket disconnected"));
    } catch (err) {
      console.warn("Socket.IO connection failed, skipping:", err);
    }

    return () => {
      socket.disconnect();
    };
  }, []);

  // -------------------
  // Invite Technician
  // -------------------
  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteMessage("");
    setInviteError("");

    try {
      if (!token) throw new Error("No token");

      const res = await axios.post(
        "http://localhost:5000/api/invitations",
        { email: inviteEmail, role },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setInviteMessage(res.data.message || "Invitation sent!");
      setInviteEmail("");

      // Refresh list (or mock)
      await fetchTechnicians();
    } catch (err) {
      console.error("Error inviting technician, using mock:", err);
      setInviteError(
        "Backend down: mock invite successful. User would be invited in real backend.",
      );

      // Add mock user for UI preview
      setTechnicians((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          name: "Pending Registration",
          email: inviteEmail,
          role,
        },
      ]);
      setInviteEmail("");
    } finally {
      setInviteLoading(false);
    }
  };

  // -------------------
  // Delete Technician
  // -------------------
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to remove ${name}?`)) return;

    try {
      if (!token) throw new Error("No token");

      await axios.delete(`http://localhost:5000/api/technicians/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTechnicians((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error deleting technician, using mock:", err);
      setTechnicians((prev) => prev.filter((t) => t.id !== id));
      alert("Backend down: mock delete successful in UI");
    }
  };

  if (loading) return <Spinner animation="border" />;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Technician Management</h2>
        <Button variant="success" onClick={() => setShowInvite(!showInvite)}>
          {showInvite ? "Close Invite" : "+ Invite Technician"}
        </Button>
      </div>

      {showInvite && (
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <Card.Title>Invite Technician</Card.Title>
            {inviteMessage && <Alert variant="success">{inviteMessage}</Alert>}
            {inviteError && <Alert variant="danger">{inviteError}</Alert>}

            <Form
              onSubmit={handleInvite}
              className="d-flex flex-wrap gap-2 align-items-end"
            >
              <Form.Group className="flex-grow-1">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter technician email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group style={{ width: "200px" }}>
                <Form.Label>Role</Form.Label>
                <Form.Control type="text" value={role} readOnly />
              </Form.Group>

              <Button
                type="submit"
                variant="primary"
                disabled={inviteLoading}
                style={{ height: "fit-content" }}
              >
                {inviteLoading ? "Sending..." : "Send Invitation"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {error && <Alert variant="warning">{error}</Alert>}

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {technicians.map((tech) => (
            <tr key={tech.id}>
              <td>{tech.name}</td>
              <td>{tech.email}</td>
              <td>{tech.role}</td>
              <td>
                <Button
                  variant="danger"
                  onClick={() => handleDelete(tech.id, tech.name)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default TechnicianManagement;
