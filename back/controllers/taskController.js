// controllers/taskController.js
const Task = require("../models/Task");
const User = require("../models/User");
const SystemLog = require("../models/SystemLog"); // optional

const createTask = async (req, res) => {
  try {
    const { title, description, department, priority } = req.body;

    // 1️⃣ Create task without technician
    const task = new Task({
      title,
      description,
      department,
      priority,
      createdBy: req.user.id,
    });

    // 2️⃣ Find available technician
    const technician = await User.find({ role: "technician", department })
      .sort({ activeTasks: 1 }) // need activeTasks count
      .limit(1);

    if (technician.length) {
      task.assignedTechnician = technician[0]._id;
      task.status = "assigned";

      // Optional: increment activeTasks count on technician
      technician[0].activeTasks = (technician[0].activeTasks || 0) + 1;
      await technician[0].save();

      // Optional: log system auto-assignment
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

module.exports = { createTask };
