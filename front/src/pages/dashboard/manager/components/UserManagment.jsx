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
} from "react-bootstrap";

import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  autoConnect: false,
});

const rolesToShow = ["technician", "pharmacyStore", "depStaff"];

const UsersManagement = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("technician");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteError, setInviteError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [roleFilter, setRoleFilter] = useState("");

  const token = localStorage.getItem("token");

  // ==============================
  // Debounce Search
  // ==============================
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm.length >= 2) setDebouncedSearch(searchTerm);
      else setDebouncedSearch("");
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // ==============================
  // Fetch Users
  // ==============================
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/manager/users?all=${showAll}${
          debouncedSearch ? `&search=${debouncedSearch}` : ""
        }${roleFilter ? `&role=${roleFilter}` : ""}`,

        { headers: { Authorization: `Bearer ${token}` } },
      );

      // Normalize names for pending users
      const normalized = res.data.map((u) => ({
        ...u,
        name: u.status === "pending" ? "Pending Registration" : u.name,
      }));

      setUserList(normalized);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [debouncedSearch, roleFilter]);

  // Invite User
  // ==============================
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    setInviteMessage("");
    setInviteError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/invitations",
        { email: inviteEmail, role: inviteRole },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setInviteMessage("Invitation sent Succesfully!");
      setInviteEmail("");
      fetchUsers();
    } catch (err) {
      setInviteError(
        err.response?.data?.message || "Failed to send invitation",
      );
    } finally {
      setInviteLoading(false);
    }
  };

  // ==============================
  // Delete User / Invite
  // ==============================
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name}?`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/manager/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserList((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // ==============================
  // Activate / Deactivate
  // ==============================
  const handleDeactivate = async (user) => {
    const newStatus = user.status === "active" ? "inactive" : "active";
    try {
      const res = await axios.patch(
        `http://localhost:5000/api/manager/users/${user.id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setUserList((prev) =>
        prev.map((u) =>
          u.id === user.id ? { ...u, status: res.data.staff.status } : u,
        ),
      );
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Spinner animation="border" className="m-4" />;

  // Slice + Role filter
  let filtered = roleFilter
    ? userList.filter((u) => u.role === roleFilter)
    : userList;

  const displayedUsers = showAll
    ? filtered
    : [
        ...filtered.filter((u) => u.status === "active").slice(0, 3),
        ...filtered.filter((u) => u.status === "pending").slice(0, 3),
        ...filtered.filter((u) => u.status === "inactive"),
      ];

  return (
    <div className="p-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap">
        <h2 className="fw-bold text-primary">Users Management</h2>
        <Button variant="dark" onClick={() => setShowInvite(!showInvite)}>
          {showInvite ? "Close Invite" : "+ Invite Users"}
        </Button>
      </div>

      {/* Invite Form */}
      {showInvite && (
        <Card className="mb-3 shadow border-0">
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
                <Form.Select
                  size="sm"
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                >
                  {rolesToShow.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </Form.Select>
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
            {inviteMessage && <Alert variant="success">{inviteMessage}</Alert>}
            {inviteError && <Alert variant="danger">{inviteError}</Alert>}
          </Card.Body>
        </Card>
      )}

      {/* Search + Filter */}
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <div className="d-flex gap-2 flex-wrap">
          <Form.Control
            size="sm"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ minWidth: "200px" }}
          />
          <Form.Select
            size="sm"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            {rolesToShow.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </Form.Select>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Table - Desktop */}
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
                {displayedUsers.map((u) => (
                  <tr key={u.id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                    <td>
                      <Badge
                        bg={
                          u.status === "active"
                            ? "success"
                            : u.status === "inactive"
                              ? "secondary"
                              : "warning"
                        }
                        text={u.status === "pending" ? "dark" : ""}
                      >
                        {u.status === "pending"
                          ? "Pending Registration"
                          : u.status}
                      </Badge>
                    </td>
                    <td>
                      {u.status !== "pending" && (
                        <Button
                          size="sm"
                          variant={u.status === "active" ? "danger" : "success"}
                          onClick={() => handleDeactivate(u)}
                          className="me-2"
                        >
                          {u.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline-danger"
                        onClick={() => handleDelete(u.id, u.name)}
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

      {/* Cards - Mobile */}
      <div className="d-md-none">
        {displayedUsers.map((u) => (
          <Card key={u.id} className="mb-3 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{u.name}</strong>
                  <div style={{ fontSize: "0.85rem", color: "#555" }}>
                    {u.email}
                  </div>
                </div>
                <Badge
                  bg={
                    u.status === "active"
                      ? "success"
                      : u.status === "inactive"
                        ? "secondary"
                        : "warning"
                  }
                  text={u.status === "pending" ? "dark" : ""}
                >
                  {u.status === "pending" ? "Pending Registration" : u.status}
                </Badge>
              </div>
              <div className="mt-2 d-flex gap-2">
                {u.status !== "pending" && (
                  <Button
                    size="sm"
                    variant={u.status === "active" ? "danger" : "success"}
                    onClick={() => handleDeactivate(u)}
                  >
                    {u.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline-danger"
                  onClick={() => handleDelete(u.id, u.name)}
                >
                  Delete
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* ShowAll button left below table */}
      <div className="mt-3 text-start">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Show Less" : "ShowAll"}
        </Button>
      </div>
    </div>
  );
};

export default UsersManagement;
