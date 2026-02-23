import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";
import InviteModal from "../components/InviteModal";
import { useNavigate } from "react-router-dom";

const PharmacyStoreManagement = () => {
  const [showInvite, setShowInvite] = useState(false);

  const store = [
    { id: 1, name: "Main Pharmacy", email: "main@pharma.com" },
    { id: 2, name: "Branch Pharmacy", email: "branch@pharma.com" },
    { id: 3, name: "Branch Pharmacy", email: "branch@pharma.com" },
  ];

  const handleDelete = (id, name) => {
    if (window.confirm(`Remove ${name}?`)) {
      console.log("DELETE STORE:", id);
    }

  };
     const navigate = useNavigate();

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between mb-4">
        <h2>Pharmacy Store Management</h2>
        <Button className="px-3" onClick={() => setShowInvite(true)}>
          + Invite pharStore
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
          {store.map((store) => (
            <tr
              key={store.id}
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/manager/pharmacystore/${store.id}`)}
            >
              <td>{store.name}</td>
              <td>{store.email}</td>
              <td>{store.status}</td>
              <td
                onClick={(e) => e.stopPropagation()} // prevents row click when clicking icon
              >
                <i
                  className="bi bi-trash text-danger"
                  onClick={() => handleDelete(store.id, store.name)}
                ></i>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <InviteModal
        show={showInvite}
        handleClose={() => setShowInvite(false)}
        userType="PharmacyStore"
      />
    </div>
  );
};

export default PharmacyStoreManagement;
