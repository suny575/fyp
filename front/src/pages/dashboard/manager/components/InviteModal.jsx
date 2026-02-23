import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const InviteModal = ({ show, handleClose, userType }) => {
  const [email, setEmail] = useState("");

  const handleInvite = () => {
    if (!email) return alert("Email required");

    console.log("Invite:", email, "Role:", userType);

    // TODO: Replace with real backend call
    // axios.post("/api/users/invite", { email, role: userType })

    setEmail("");
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Invite {userType}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder={`Enter ${userType} email`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleInvite}>
          Send Invite
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InviteModal;
