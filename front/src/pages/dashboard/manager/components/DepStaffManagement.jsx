import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  Table,
  Button,
  Form,
  Badge,
  Spinner,
  Alert,
  Collapse,
} from "react-bootstrap";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  autoConnect: false,
});

const DepStaffManagement = () => {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteError, setInviteError] = useState("");

  const [selectedStaff, setSelectedStaff] = useState(null);

  const token = localStorage.getItem("token");

  // ==============================
  // FETCH STAFF (ACTIVE + PENDING)
  // ==============================
  const fetchStaff = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/depstaff", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Ensure pending users have proper name & status
      const normalized = res.data.map((staff) => ({
        ...staff,
        name:
          staff.status === "pending"
            ? "Pending Registration"
            : staff.name || "Registered Staff",
      }));

      setStaffList(normalized);
      setError("");
    } catch (err) {
      console.error("Error fetching dep staff:", err);
      setError("Failed to fetch department staff");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // INITIAL LOAD + SOCKET
  // ==============================
  useEffect(() => {
    fetchStaff();

    socket.connect();
    socket.on("connect", () => console.log("Socket connected:", socket.id));

    socket.on("depStaffRegistered", (data) => {
      setStaffList((prev) =>
        prev.map((staff) =>
          staff.email === data.email
            ? { ...staff, name: data.name, status: "active" }
            : staff,
        ),
      );
    });

    return () => socket.disconnect();
  }, []);

  // ==============================
  // INVITE DEP STAFF
  // ==============================
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteMessage("");
    setInviteError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/invitations",
        { email: inviteEmail, role: "depStaff" },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setInviteMessage(res.data.message || "Invitation sent!");
      setInviteEmail("");

      await fetchStaff();
    } catch (err) {
      setInviteError(
        err.response?.data?.message || "Failed to send invitation",
      );
    } finally {
      setInviteLoading(false);
    }
  };

  // ==============================
  // DELETE STAFF
  // ==============================
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name}?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/depstaff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffList((prev) => prev.filter((s) => s._id !== id));
      if (selectedStaff?._id === id) setSelectedStaff(null);
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // DEACTIVATE STAFF
  // ==============================
  const handleDeactivate = async (staff) => {
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/depstaff/${staff._id}/deactivate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );

      setStaffList((prev) =>
        prev.map((s) =>
          s._id === staff._id ? { ...s, status: res.data.staff.status } : s,
        ),
      );
    } catch (err) {
      console.error("Deactivate failed:", err);
    }
  };

  if (loading) return <Spinner animation="border" className="m-4" />;

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
        <h2 className="fw-bold text-primary">Department Staff Management</h2>
        <Button
          variant="dark"
          onClick={() => setShowInvite(!showInvite)}
          className="mt-2 mt-md-0"
        >
          {showInvite ? "Close Invite" : "+ Invite Staff"}
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* INVITE FORM */}
      {showInvite && (
        <Card className="mb-4 shadow border-0">
          <Card.Body>
            <Form
              onSubmit={handleInviteSubmit}
              className="d-flex gap-2 align-items-end flex-wrap"
              style={{ maxWidth: "600px" }}
            >
              <Form.Group style={{ flex: "2" }}>
                <Form.Label className="small mb-1">Email</Form.Label>
                <Form.Control
                  size="sm"
                  type="email"
                  placeholder="staff@email.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group style={{ flex: "1" }}>
                <Form.Label className="small mb-1">Role</Form.Label>
                <Form.Control size="sm" value="depStaff" readOnly />
              </Form.Group>

              <Button
                type="submit"
                size="sm"
                variant="dark"
                disabled={inviteLoading}
                style={{ height: "32px", minWidth: "110px" }}
              >
                {inviteLoading ? "Sending..." : "Invite"}
              </Button>
            </Form>

            {inviteMessage && (
              <Alert variant="success" className="mt-3">
                {inviteMessage}
              </Alert>
            )}

            {inviteError && (
              <Alert variant="danger" className="mt-3">
                {inviteError}
              </Alert>
            )}
          </Card.Body>
        </Card>
      )}

      {/* STAFF TABLE - Desktop */}
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
                {staffList.map((staff) => (
                  <tr
                    key={staff._id}
                    onClick={() => setSelectedStaff(staff)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{staff.name}</td>
                    <td>{staff.email}</td>
                    <td>{staff.role}</td>
                    <td>
                      {staff.status === "active" && (
                        <Badge bg="success">Active</Badge>
                      )}
                      {staff.status === "pending" && (
                        <Badge bg="warning" text="dark">
                          Pending Registration
                        </Badge>
                      )}
                      {staff.status === "inactive" && (
                        <Badge bg="secondary">Inactive</Badge>
                      )}
                    </td>
                    <td>
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(staff._id, staff.name);
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

      {/* STAFF CARDS - Mobile */}
      <div className="d-md-none">
        {staffList.map((staff) => (
          <Card
            key={staff._id}
            className="mb-3 shadow-sm"
            onClick={() => setSelectedStaff(staff)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{staff.name}</strong>
                  <div style={{ fontSize: "0.85rem", color: "#555" }}>
                    {staff.email}
                  </div>
                </div>
                <Badge
                  bg={
                    staff.status === "active"
                      ? "success"
                      : staff.status === "inactive"
                        ? "secondary"
                        : "warning"
                  }
                  text={staff.status === "pending" ? "dark" : ""}
                >
                  {staff.status === "pending"
                    ? "Pending Registration"
                    : staff.status}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* ============================== */}
      {/* DETAIL PANEL */}
      {/* ============================== */}
      <Collapse in={!!selectedStaff}>
        <Card className="mt-3 shadow border-0">
          <Card.Body>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedStaff(null)}
              className="mb-3"
            >
              ← Back
            </Button>
            {selectedStaff && (
              <>
                <h5>{selectedStaff.name}</h5>
                <p>
                  <strong>Email:</strong> {selectedStaff.email}
                </p>
                <p>
                  <strong>Role:</strong> {selectedStaff.role}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedStaff.status === "active" && (
                    <Badge bg="success">Active</Badge>
                  )}
                  {selectedStaff.status === "pending" && (
                    <Badge bg="warning" text="dark">
                      Pending Registration
                    </Badge>
                  )}
                  {selectedStaff.status === "inactive" && (
                    <Badge bg="secondary">Inactive</Badge>
                  )}
                </p>

                {selectedStaff.status !== "pending" && (
                  <Button
                    size="sm"
                    variant={
                      selectedStaff.status === "active" ? "danger" : "success"
                    }
                    onClick={() => handleDeactivate(selectedStaff)}
                    className="mb-3"
                  >
                    {selectedStaff.status === "active"
                      ? "Deactivate User"
                      : "Activate User"}
                  </Button>
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </Collapse>
    </div>
  );
};

export default DepStaffManagement;
