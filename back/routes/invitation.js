const express = require("express");
const router = express.Router();
const Invitation = require("../models/Invitation");

// Send invitation
router.post("/", async (req, res) => {
  try {
    const invitation = new Invitation(req.body);
    await invitation.save();
    res.status(201).json(invitation);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get all invitations
router.get("/", async (req, res) => {
  try {
    const invitations = await Invitation.find();
    res.json(invitations);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
