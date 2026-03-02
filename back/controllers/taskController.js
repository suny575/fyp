// controllers/taskController.js
import Task from "../models/Task.js";
import User from "../models/user.js";
import SystemLog from "../models/SystemLog.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, department, priority } = req.body;

    const task = new Task({
      title,
      description,
      department,
      priority,
      createdBy: req.user.id,
    });

    const technician = await User.find({ role: "technician", department })
      .sort({ activeTasks: 1 })
      .limit(1);

    if (technician.length) {
      task.assignedTechnician = technician[0]._id;
      task.status = "assigned";

      technician[0].activeTasks = (technician[0].activeTasks || 0) + 1;
      await technician[0].save();

      await SystemLog.create({
        actionType: "AUTO_ASSIGN",
        performedBy: "SYSTEM",
        referenceId: task._id,
        message: `Task auto-assigned to technician ${technician[0].name}`,
      });
    }

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
