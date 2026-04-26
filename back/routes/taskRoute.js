import express from "express";
import mongoose from "mongoose";
import Task from "../models/Task.js";
import Equipment from "../models/equipment.js";
import Fault from "../models/Fault.js";
import User from "../models/user.js";
import protect from "../middleware/authMiddleware.js";
import { sendNotification } from "../services/notification.service.js";
import { withHospitalScope } from "../utils/hospitalScope.js";

const router = express.Router();
router.use(protect);

router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find(
      withHospitalScope(
        { assignedTechnician: req.user._id },
        req.user.hospital,
      ),
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
      .populate("reportedBy", "name hospital")
      .populate("updatedBy", "name");

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
    task.updatedBy = req.user._id;
    if (status === "completed") {
      task.completedAt = new Date();
      // Update equipment status back to active
      await Equipment.findByIdAndUpdate(task.equipment, { status: "active" });
    }
    await task.save();

    res.json(task);
  } catch (err) {
    console.error("Update status error:", err.message);
    res.status(500).json({ message: "Server error updating task" });
  }
});

router.put("/:id/assign-technician", async (req, res) => {
  try {
    const { technicianId } = req.body;

    const task = await Task.findOne(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
    ).populate("assignedTechnician", "name");

    if (!task) return res.status(404).json({ message: "Task not found" });

    let technicianQuery = {};
    if (mongoose.Types.ObjectId.isValid(technicianId)) {
      technicianQuery._id = technicianId;
    } else {
      technicianQuery.name = technicianId;
    }

    const technician = await User.findOne(
      withHospitalScope(
        { ...technicianQuery, role: "technician", status: { $ne: "inactive" } },
        req.user.hospital,
      ),
    );

    if (!technician) {
      return res
        .status(400)
        .json({ message: "Technician not found or inactive" });
    }

    const oldTechnician = task.assignedTechnician;
    task.assignedTechnician = technician._id;
    await task.save();

    // Send notification to new technician
    await sendNotification({
      trigger: "TASK_ASSIGNED",
      recipientUsers: [technician._id],
      payload: {
        taskId: task._id,
        equipmentName: task.equipment?.name || "Equipment",
        assignedBy: req.user.name,
        link: "https://fyp-indol-one.vercel.app/technician/tasks",
      },
    });

    res.json({
      task: await Task.findById(task._id).populate(
        "assignedTechnician",
        "name",
      ),
      message: "Technician reassigned successfully",
    });
  } catch (err) {
    console.error("Assign technician error:", err.message);
    res.status(500).json({ message: "Server error assigning technician" });
  }
});

export default router;

