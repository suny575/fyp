import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Spinner, Alert, Table, Badge } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const DepStaffDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [staff, setStaff] = useState(null);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const staffRes = await axios.get(
          `http://localhost:5000/api/depstaff/${id}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        const requestsRes = await axios.get(
          `http://localhost:5000/api/depstaff/${id}/requests`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setStaff(staffRes.data);
        setRequests(requestsRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load DepStaff data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDeactivate = async () => {
    if (!window.confirm(`Deactivate ${staff.name}?`)) return;
    try {
      setStatusUpdating(true);
      const res = await axios.patch(
        `http://localhost:5000/api/depstaff/${id}/deactivate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setStaff(res.data.staff);
    } catch (err) {
      console.error(err);
      alert("Failed to deactivate user");
    } finally {
      setStatusUpdating(false);
    }
  };

  if (loading) return <Spinner animation="border" className="m-4" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <div className="p-4">
      <Button
        variant="secondary"
        size="sm"
        className="mb-3"
        onClick={() => navigate(-1)}
      >
        ← Back
      </Button>

      <Card className="mb-4 shadow-sm border-0">
        <Card.Body className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h4>{staff.name}</h4>
            <p className="mb-1">{staff.email}</p>
            <p>
              Status:{" "}
              {staff.status === "active" && <Badge bg="success">Active</Badge>}
              {staff.status === "pending" && (
                <Badge bg="warning" text="dark">
                  Pending
                </Badge>
              )}
              {staff.status === "inactive" && (
                <Badge bg="secondary">Inactive</Badge>
              )}
            </p>
            <p>Role: {staff.role}</p>
          </div>

          <Button
            variant="outline-danger"
            size="sm"
            disabled={statusUpdating || staff.status === "inactive"}
            onClick={handleDeactivate}
          >
            {statusUpdating ? "Updating..." : "Deactivate User"}
          </Button>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <h5>Requests</h5>
          {requests.length === 0 ? (
            <p className="text-muted">This staff member has no requests yet.</p>
          ) : (
            <Table responsive hover className="align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {requests.map((req) => (
                  <tr key={req._id}>
                    <td>{req.type || "Fault/Stock"}</td>
                    <td>{req.description}</td>
                    <td>
                      {req.status === "pending" && (
                        <Badge bg="warning" text="dark">
                          Pending
                        </Badge>
                      )}
                      {req.status === "in-progress" && (
                        <Badge bg="info" text="dark">
                          In Progress
                        </Badge>
                      )}
                      {req.status === "completed" && (
                        <Badge bg="success">Completed</Badge>
                      )}
                    </td>
                    <td>
                      {req.priority
                        ? req.priority.charAt(0).toUpperCase() +
                          req.priority.slice(1)
                        : "—"}
                    </td>
                    <td>{new Date(req.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default DepStaffDetails;


