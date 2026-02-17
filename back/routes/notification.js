const express = require("express");
const router = express.Router();
const Notification = require("../models/Notification");

// Create notification
router.post("/", async (req, res) => {
  try {
    const notification = new Notification(req.body);
    await notification.save();
    res.status(201).json(notification);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get notifications
router.get("/", async (req, res) => {
  try {
    const notifications = await Notification.find();
    res.json(notifications);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
