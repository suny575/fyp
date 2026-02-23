const express = require("express");
const router = express.Router();
const Invitation = require("../models/invitation");


// ==============================
// 1️⃣ Send Invitation
// ==============================
router.post("/", async (req, res) => {
  try {
    const { email, role, sentBy } = req.body;

    if (!email || !role) {
      return res.status(400).json({ msg: "Email and role are required" });
    }

    // Check if invitation already exists and still pending
    const existingInvitation = await Invitation.findOne({
      email,
      role,
      used: false,
    });

    if (existingInvitation) {
      return res.status(400).json({
        msg: "An active invitation already exists for this user",
      });
    }

    // Set expiration (24 hours)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    const invitation = new Invitation({
      email,
      role,
      sentBy,
      expiresAt,
    });

    await invitation.save();

    res.status(201).json({
      msg: "Invitation sent successfully",
      invitation,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});


// ==============================
// 2️⃣ Get All Invitations
// ==============================
router.get("/", async (req, res) => {
  try {
    const invitations = await Invitation.find().populate("sentBy", "name email");
    res.json(invitations);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


// ==============================
// 3️⃣ Verify Invitation (Before Register)
// ==============================
router.get("/:id", async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);

    if (!invitation) {
      return res.status(404).json({ msg: "Invitation not found" });
    }

    if (invitation.used) {
      return res.status(400).json({ msg: "Invitation already used" });
    }

    if (invitation.expiresAt < new Date()) {
      return res.status(400).json({ msg: "Invitation expired" });
    }

    res.json(invitation);

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});


// ==============================
// 4️⃣ Mark Invitation as Used (Optional manual route)
// ==============================
router.put("/use/:id", async (req, res) => {
  try {
    const invitation = await Invitation.findById(req.params.id);

    if (!invitation) {
      return res.status(404).json({ msg: "Invitation not found" });
    }

    invitation.used = true;
    invitation.status = "accepted";

    await invitation.save();

    res.json({ msg: "Invitation marked as used" });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
