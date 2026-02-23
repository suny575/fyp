import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Card, Button, Spinner } from "react-bootstrap";

const UserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // 🔥 TRY BACKEND FIRST
        const res = await axios.get(`/api/users/${id}`);
        setUser(res.data);
      } catch (error) {
        console.log("Backend not connected. Using mock data.");

        // 🔥 MOCK DATA FALLBACK
        setUser({
          id,
          name: "Mock User",
          email: "mock@test.com",
          role: "Technician",
          status: "Active",
          createdAt: "2026-02-01",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <div className="p-4">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <Button variant="secondary" className="mb-4" onClick={() => navigate(-1)}>
        ← Back
      </Button>

      <Card className="shadow-sm">
        <Card.Body>
          <h3 className="mb-4">User Details</h3>

          <p>
            <strong>ID:</strong> {user.id}
          </p>
          <p>
            <strong>Name:</strong> {user.name}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <p>
            <strong>Status:</strong> {user.status}
          </p>
          <p>
            <strong>Created At:</strong> {user.createdAt}
          </p>

          <div className="mt-4 d-flex gap-3">
            <Button variant="warning">Deactivate</Button>

            <Button variant="danger">Delete User</Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserDetails;
