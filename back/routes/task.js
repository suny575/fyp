const express = require("express");
const router = express.Router();
const MaintenanceTask = require("../models/MaintenanceTask");

// Create task
router.post("/", async (req, res) => {
  try {
    const task = new MaintenanceTask(req.body);
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Get all tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await MaintenanceTask.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Update task
router.put("/:id", async (req, res) => {
  try {
    const task = await MaintenanceTask.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
