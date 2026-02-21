const express = require("express");
const router = express.Router();
const TemporaryPermission = require("../models/TemporaryPermission");
const Notification = require("../models/Notification");

// Manager approves QR scan request
router.post("/approve", async (req, res) => {
  try {
    const { staffId } = req.body;

    // Create temporary permission (30 minutes)
    await TemporaryPermission.create({
      user: staffId,
      type: "qrscan",
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });

    // Optional: notify staff
    await Notification.create({
      user: staffId,
      message: "Your QR Scan request has been approved.",
    });

    res.json({ message: "QR Scan approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
