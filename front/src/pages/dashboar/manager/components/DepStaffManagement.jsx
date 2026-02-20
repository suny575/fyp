import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import InviteModal from "../components/InviteModal";
import { useNavigate } from "react-router-dom";

const DepStaffManagement = () => {
  const [showInvite, setShowInvite] = useState(false);

  const staff = [
    { id: 1, name: "Sarah", email: "sarah@test.com" },
    { id: 2, name: "John", email: "john@test.com" },
    { id: 3, name: "suny", email: "john@test.com" },
    { id: 4, name: "sena", email: "john@test.com" },
  ];

  const handleDelete = (id, name) => {
    if (window.confirm(`Remove ${name}?`)) {
      console.log("DELETE STAFF:", id);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Department Staff Management</h2>
        <Button className="px-3" onClick={() => setShowInvite(true)}>
          + Invite depStaff
        </Button>
      </div>

      <Table bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
  {staff.map((user) => (
    <tr
      key={user.id}
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/manager/depstaff/${user.id}`)}
    >
      <td>{user.name}</td>
      <td>{user.email}</td>
      <td>{user.status}</td>
      <td
        onClick={(e) => e.stopPropagation()} // prevents row click when clicking icon
      >
        <i
          className="bi bi-trash text-danger"
          onClick={() => handleDelete(user.id, user.name)}
        ></i>
      </td>
    </tr>
  ))}
</tbody>

      </Table>

      <InviteModal
        show={showInvite}
        handleClose={() => setShowInvite(false)}
        userType="DepStaff"
      />
    </div>
  );
};

export default DepStaffManagement;
