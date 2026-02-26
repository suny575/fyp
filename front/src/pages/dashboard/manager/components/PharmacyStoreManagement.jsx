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

const PharmacyStoreManagement = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [inviteLoading, setInviteLoading] = useState(false);
  const [role] = useState("pharmacystore");

  const [selectedStore, setSelectedStore] = useState(null);
  const [equipmentList, setEquipmentList] = useState([]);
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const token = localStorage.getItem("token");

  // Fetch all pharmacy stores (active + pending)
  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/pharmacystores", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Backend not reachable, showing mock preview");

      setStores([
        {
          _id: "1",
          name: "Main Pharmacy",
          email: "main@pharma.com",
          role,
          status: "active",
        },
        {
          _id: "2",
          name: "Pending Registration",
          email: "branch@pharma.com",
          role,
          status: "pending",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();

    try {
      socket.connect();
      socket.on("connect", () => console.log("Socket connected:", socket.id));

      socket.on("storeRegistered", (data) => {
        setStores((prev) =>
          prev.map((s) =>
            s.email === data.email
              ? { ...s, name: data.name, status: "active" }
              : s,
          ),
        );
      });
    } catch (err) {
      console.warn("Socket.IO failed:", err);
    }

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    const fetchEquipment = async () => {
      if (!selectedStore) return;
      setEquipmentLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:5000/api/pharmacystore/${selectedStore._id}/equipment`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setEquipmentList(res.data || []);
      } catch (err) {
        console.error("Error fetching equipment:", err);
        setEquipmentList([]);
      } finally {
        setEquipmentLoading(false);
      }
    };
    fetchEquipment();
  }, [selectedStore]);

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
      await fetchStores();
    } catch (err) {
      setInviteError(err.response?.data?.message || "Invitation failed");

      setStores((prev) => [
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
      await axios.delete(`http://localhost:5000/api/pharmacystores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores((prev) => prev.filter((s) => s._id !== id));
      if (selectedStore?._id === id) setSelectedStore(null);
    } catch (err) {
      console.error(err);
      setStores((prev) => prev.filter((s) => s._id !== id));
    }
  };

  const handleDeactivate = async (store) => {
    try {
      const updatedStatus = store.status === "active" ? "inactive" : "active";
      setStores((prev) =>
        prev.map((s) =>
          s._id === store._id ? { ...s, status: updatedStatus } : s,
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
        <h2 className="fw-bold text-primary">Pharmacy Store Management</h2>
        <Button
          variant="dark"
          onClick={() => setShowInvite(!showInvite)}
          className="shadow-sm mt-2 mt-md-0"
        >
          {showInvite ? "Close Invite" : "+ Invite Store"}
        </Button>
      </div>

      {showInvite && (
        <Card className="mb-4 shadow border-0">
          <Card.Body>
            <Card.Title className="mb-3">Invite Store</Card.Title>
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
                  placeholder="store@email.com"
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
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((store) => (
                  <tr
                    key={store._id}
                    onClick={() => setSelectedStore(store)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{store.name || "—"}</td>
                    <td>{store.email}</td>
                    <td>
                      {store.status === "active" && (
                        <Badge bg="success">Active</Badge>
                      )}
                      {store.status === "pending" && (
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
                          handleDelete(store._id, store.name || store.email);
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
        {stores.map((store) => (
          <Card
            key={store._id}
            className="mb-3 shadow-sm"
            onClick={() => setSelectedStore(store)}
            style={{ cursor: "pointer" }}
          >
            <Card.Body className="d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{store.name || "—"}</strong>
                  <div style={{ fontSize: "0.85rem", color: "#555" }}>
                    {store.email}
                  </div>
                </div>
                <Badge
                  bg={store.status === "active" ? "success" : "warning"}
                  text={store.status === "pending" ? "dark" : ""}
                >
                  {store.status}
                </Badge>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Pharmacy Store Detail Panel */}
      <Collapse in={!!selectedStore}>
        <Card className="mt-3 shadow border-0">
          <Card.Body>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setSelectedStore(null)}
              className="mb-3"
            >
              ← Back
            </Button>

            {selectedStore && (
              <>
                <h5>{selectedStore.name || "—"}</h5>
                <p>
                  <strong>Email:</strong> {selectedStore.email}
                </p>
                <p>
                  <strong>Role:</strong> {selectedStore.role}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {selectedStore.status === "active" ? (
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
                    selectedStore.status === "active" ? "danger" : "success"
                  }
                  onClick={() => handleDeactivate(selectedStore)}
                  className="mb-3"
                >
                  {selectedStore.status === "active"
                    ? "Deactivate Store"
                    : "Activate Store"}
                </Button>

                <h6>Equipment & Stock</h6>
                {equipmentLoading ? (
                  <Spinner size="sm" />
                ) : equipmentList.length === 0 ? (
                  <p className="text-muted">No equipment assigned yet.</p>
                ) : (
                  <ListGroup
                    className="mb-3"
                    style={{ maxHeight: "200px", overflowY: "auto" }}
                  >
                    {equipmentList.map((eq) => (
                      <ListGroup.Item key={eq._id}>
                        <div className="d-flex justify-content-between flex-wrap">
                          <div>
                            <strong>{eq.name}</strong>
                            <div style={{ fontSize: "0.85rem" }}>
                              Stock: {eq.stock}
                            </div>
                          </div>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}

                <div className="d-flex gap-2 flex-wrap">
                  <Button size="sm" variant="outline-primary">
                    Export Stock
                  </Button>
                  <Button size="sm" variant="outline-secondary">
                    Filter by Equipment
                  </Button>
                  <Button size="sm" variant="outline-secondary">
                    Filter by Stock Status
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

export default PharmacyStoreManagement;
