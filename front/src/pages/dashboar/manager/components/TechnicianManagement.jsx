import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import InviteModal from "../components/InviteModal";

const TechnicianManagement = () => {
  const [showInvite, setShowInvite] = useState(false);
  const technicians = [
    { id: 1, name: "Alice", email: "alice@test.com" },
    { id: 2, name: "sun", email: "sun@test.com" },
    { id: 3, name: "Bob", email: "bob@test.com" },
  ];
  const navigate = useNavigate();

  const handleDelete = (id, name) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove ${name}?`,
    );

    if (confirmDelete) {
      console.log("DELETE USER ID:", id);
      // axios.delete(`/api/users/${id}`)
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Technician Management</h2>
        <Button className="px-3" onClick={() => setShowInvite(true)}>
          + Invite Technician
        </Button>
      </div>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th style={{ width: "150px" }}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {technicians.map((tech) => (
            <tr
              key={tech.id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/manager/technician/${tech.id}`)}
            >
              <td>{tech.name}</td>
              <td>{tech.email}</td>

              <td
                onClick={(e) => e.stopPropagation()}
              >
                <i
                  className="bi bi-trash text-danger"
                  onClick={() => handleDelete(tech.id, tech.name)}
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <InviteModal
        show={showInvite}
        handleClose={() => setShowInvite(false)}
        userType="Technician"
      />
    </div>
  );
};

export default TechnicianManagement;
