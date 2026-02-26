import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Table,
  Badge,
  Collapse,
  ListGroup,
} from "react-bootstrap";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  autoConnect: false,
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
  const [role] = useState("technician");

  const [selectedTech, setSelectedTech] = useState(null); // for detail panel
  const [tasks, setTasks] = useState([]);
  const [taskLoading, setTaskLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch all technicians including pending invitations
  const fetchTechnicians = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/technicians", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTechnicians(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Backend not reachable, showing mock preview");

      setTechnicians([
        {
          _id: "1",
          name: "John Doe",
          email: "john@example.com",
          role: "technician",
          status: "active",
        },
        {
          _id: "2",
          name: "Pending Registration",
          email: "pending@example.com",
          role: "technician",
          status: "pending",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTechnicians();

    try {
      socket.connect();
      socket.on("connect", () => console.log("Socket connected:", socket.id));

      socket.on("technicianRegistered", (data) => {
        console.log("New technician registered:", data);
        setTechnicians((prev) =>
          prev.map((tech) =>
            tech.email === data.email
              ? { ...tech, name: data.name, status: "active" }
              : tech,
          ),
        );
      });
    } catch (err) {
      console.warn("Socket.IO failed:", err);
    }

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedTech) return;

      setTaskLoading(true);

      try {
        const res = await axios.get(
          `http://localhost:5000/api/technician/${selectedTech._id}/tasks`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        setTasks(res.data || []);
      } catch (err) {
        console.error("Error fetching tasks:", err);
        setTasks([]);
      } finally {
        setTaskLoading(false);
      }
    };

    fetchTasks();
  }, [selectedTech]);

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteMessage("");
    setInviteError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/invitations",
        { email: inviteEmail, role },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setInviteMessage(res.data.message || "Invitation sent!");
      setInviteEmail("");
      await fetchTechnicians();
    } catch (err) {
      setInviteError(err.response?.data?.message || "Invitation failed");

      setTechnicians((prev) => [
        ...prev,
        {
          _id: crypto.randomUUID(),
          name: "Pending Registration",
          email: inviteEmail,
          role,
          status: "pending",
        },
      ]);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name}?`)) return;

    try {
      await axios.delete(`http://localhost:5000/api/technicians/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTechnicians((prev) => prev.filter((t) => t._id !== id));
      if (selectedTech?._id === id) setSelectedTech(null);
    } catch (err) {
      console.error(err);
      setTechnicians((prev) => prev.filter((t) => t._id !== id));
    }
  };

  const handleDeactivate = async (tech) => {
    try {
      // Mock deactivate for now (update backend endpoint as needed)
      const updatedStatus = tech.status === "active" ? "inactive" : "active";
      setTechnicians((prev) =>
        prev.map((t) =>
          t._id === tech._id ? { ...t, status: updatedStatus } : t,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Spinner animation="border" className="m-4" />;

  return (
    <div className="p-3 p-md-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2 className="fw-bold text-primary">Technician Management</h2>
        <Button
          variant="dark"
          onClick={() => setShowInvite(!showInvite)}
          className="shadow-sm mt-2 mt-md-0"
        >
          {showInvite ? "Close Invite" : "+ Invite Technician"}
        </Button>
      </div>

      {showInvite && (
        <Card className="mb-4 shadow border-0">
          <Card.Body>
            <Card.Title className="mb-3">Invite Technician</Card.Title>
            {inviteMessage && <Alert variant="success">{inviteMessage}</Alert>}
            {inviteError && <Alert variant="danger">{inviteError}</Alert>}

            <Form
              onSubmit={handleInvite}
              className="d-flex align-items-end gap-2 flex-wrap"
              style={{ maxWidth: "600px" }}
            >
              <Form.Group style={{ flex: "2" }}>
                <Form.Label className="small mb-1">Email</Form.Label>
                <Form.Control
                  size="sm"
                  type="email"
                  placeholder="technician@email.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group style={{ flex: "1" }}>
                <Form.Label className="small mb-1">Role</Form.Label>
                <Form.Control size="sm" value={role} readOnly />
              </Form.Group>

              <Button
                type="submit"
                size="sm"
                variant="dark"
                disabled={inviteLoading}
                style={{ height: "31px", minWidth: "120px" }}
              >
                {inviteLoading ? "Sending..." : "Invite"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      )}

      {error && <Alert variant="warning">{error}</Alert>}

      {/* Desktop Table */}
      <div className="d-none d-md-block">
        <Card className="shadow border-0 overflow-auto">
          <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
            <Table hover responsive className="align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {technicians.map((tech) => (
                  <tr
                    key={tech._id}
                    onClick={() => setSelectedTech(tech)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{tech.name || "—"}</td>
                    <td>{tech.email}</td>
                    <td>{tech.role}</td>
                    <td>
                      {tech.status === "active" && (
                        <Badge bg="success">Active</Badge>
                      )}
                      {tech.status === "pending" && (
                        <Badge bg="warning" text="dark">
                          Pending
                        </Badge>
                      )}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(tech._id, tech.name || tech.email);
                        }}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </div>

      {/* Mobile Cards */}
      <div className="d-md-none">
        {technicians.map((tech) => (
          <Card
            key={tech._id}
            className="mb-3 shadow-sm"
            onClick={() => setSelectedTech(tech)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{tech.name || "—"}</strong>
                  <div style={{ fontSize: "0.85rem", color: "#555" }}>
                    {tech.email}
                  </div>
                </div>
                <Badge
                  bg={tech.status === "active" ? "success" : "warning"}
                  text={tech.status === "pending" ? "dark" : ""}
                >
                  {tech.status}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Technician Detail Panel */}
      <Collapse in={!!selectedTech}>
        <Card className="mt-3 shadow border-0">
          <Card.Body>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedTech(null)}
              className="mb-3"
            >
              ← Back
            </Button>

            {selectedTech && (
              <>
                <h5>{selectedTech.name || "—"}</h5>
                <p>
                  <strong>Email:</strong> {selectedTech.email}
                </p>
                <p>
                  <strong>Role:</strong> {selectedTech.role}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedTech.status === "active" ? (
                    <Badge bg="success">Active</Badge>
                  ) : (
                    <Badge bg="warning" text="dark">
                      Pending
                    </Badge>
                  )}
                </p>

                <Button
                  size="sm"
                  variant={
                    selectedTech.status === "active" ? "danger" : "success"
                  }
                  onClick={() => handleDeactivate(selectedTech)}
                  className="mb-3"
                >
                  {selectedTech.status === "active"
                    ? "Deactivate User"
                    : "Activate User"}
                </Button>

                <h6>Task History</h6>

                {taskLoading ? (
                  <Spinner size="sm" />
                ) : tasks.length === 0 ? (
                  <p className="text-muted">
                    This technician has no assigned tasks.
                  </p>
                ) : (
                  <ListGroup
                    className="mb-3"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {tasks.map((task) => (
                      <ListGroup.Item key={task._id}>
                        <div className="d-flex justify-content-between flex-wrap">
                          <div>
                            <strong>{task.title}</strong>
                            <div style={{ fontSize: "0.85rem" }}>
                              {task.description}
                            </div>
                          </div>

                          <div>
                            {task.status === "completed" && (
                              <Badge bg="success">Completed</Badge>
                            )}
                            {task.status === "pending" && (
                              <Badge bg="warning" text="dark">
                                Pending
                              </Badge>
                            )}
                          </div>
                        </div>

                        {task.completedAt && (
                          <div
                            style={{ fontSize: "0.75rem", marginTop: "4px" }}
                          >
                            Completed at:{" "}
                            {new Date(task.completedAt).toLocaleDateString()}
                          </div>
                        )}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}

                {/* Export & Filter Options */}
                <div className="d-flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline-primary">
                    Export Report
                  </Button>
                  <Button size="sm" variant="outline-secondary">
                    Filter by Task Type
                  </Button>
                  <Button size="sm" variant="outline-secondary">
                    Filter by Period
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      </Collapse>
    </div>
  );
};

export default TechnicianManagement;
