// routes/taskRoutes.js
import express from "express";
import Task from "../models/Task.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(protect);

// GET all tasks for logged-in technician
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTechnician: req.user._id });
    res.json(tasks);
  } catch (err) {
    console.error("Fetch tasks error:", err.message);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
});

// Update task status
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["waiting", "pending", "in_progress", "completed"];
    if (!allowedStatuses.includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const task = await Task.findOne({
      _id: req.params.id,
      assignedTechnician: req.user._id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.status = status;
    if (status === "completed") task.completedAt = new Date();
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("Update status error:", err.message);
    res.status(500).json({ message: "Server error updating task" });
  }
});

export default router;
