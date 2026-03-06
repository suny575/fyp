// controllers/taskController.js
import convertFaultToTask from "../services/assignment.service.js";
import Fault from "../models/Fault.js";

// ✅ TaskController now just handles task-related requests via the service
export const createTaskFromFault = async (req, res) => {
  try {
    const { faultId } = req.body;

    if (!faultId) {
      return res.status(400).json({ message: "faultId is required" });
    }

    // Call the service to handle all the business logic:
    // - Assign least busy technician
    // - Create task
    // - Update fault status
    // - Send notifications
    const task = await convertFaultToTask(faultId);

    res.status(201).json({
      message: "Task created successfully from fault",
      task,
    });
  } catch (err) {
    console.error("Task creation from fault failed:", err.message);

    // Optional: update fault or notify reporter in case of failure
    if (req.body.faultId) {
      await Fault.findByIdAndUpdate(req.body.faultId, {
        status: "waiting", // still waiting for task assignment
      });
    }

    res.status(500).json({
      message: "Failed to create task from fault. Reporter notified if needed.",
      error: err.message,
    });
  }
};
