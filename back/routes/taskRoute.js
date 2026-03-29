import express from "express";
import Task from "../models/Task.js";
import protect from "../middleware/authMiddleware.js";
import { withHospitalScope } from "../utils/hospitalScope.js";

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find(
      withHospitalScope({ assignedTechnician: req.user._id }, req.user.hospital),
    )
      .populate("equipment", "name department hospital")
      .populate("assignedTechnician", "name hospital")
      .populate("reportedBy", "name hospital");

    res.json(tasks);
  } catch (err) {
    console.error("Fetch tasks error:", err.message);
    res.status(500).json({ message: "Server error fetching tasks" });
  }
});

router.get("/allTasks", async (req, res) => {
  try {
    const tasks = await Task.find(withHospitalScope({}, req.user.hospital));
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const tasks = await Task.find(withHospitalScope({}, req.user.hospital))
      .populate("equipment", "name department hospital")
      .populate("assignedTechnician", "name hospital")
      .populate("reportedBy", "name hospital");

    res.json(tasks);
  } catch (err) {
    console.error("Fetch all tasks error:", err.message);
    res.status(500).json({ message: "Server error fetching all tasks" });
  }
});

router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["waiting", "inProgress", "completed"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const task = await Task.findOne(
      withHospitalScope(
        {
          _id: req.params.id,
          assignedTechnician: req.user._id,
        },
        req.user.hospital,
      ),
    );

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
