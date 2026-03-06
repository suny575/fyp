import User from "../models/user.js";
import Task from "../models/Task.js";
import Fault from "../models/Fault.js";
import sendNotification from "./notification.service.js";

const convertFaultToTask = async (faultId) => {
  const fault = await Fault.findById(faultId)
    .populate("reportedBy")
    .populate("equipment");

  if (!fault) throw new Error("Fault not found");

  if (fault.status !== "waiting") throw new Error("Fault already processed");

  // 🔎 Find least busy technician
  const technicians = await User.find({ role: "technician" });

  if (!technicians.length) {
    // No need to notify technician unavailability
    throw new Error("No technicians in system");
  }

  let minTasks = Infinity;
  let selectedTech = null;

  for (const tech of technicians) {
    const count = await Task.countDocuments({
      assignedTechnician: tech._id,
      status: { $in: ["waiting", "in_progress"] },
    });

    if (count < minTasks) {
      minTasks = count;
      selectedTech = tech;
    }
  }

  if (!selectedTech) throw new Error("Technician selection failed");

  // 🛠 Create Task
  const task = await Task.create({
    name: `Maintenance: ${fault.description.substring(0, 30)}`,
    equipment: fault.equipment,
    department: fault.department,
    description: fault.description,
    priority: fault.priority,
    assignedTechnician: selectedTech._id,
    faultRef: fault._id,
    reportedBy: fault.reportedBy._id,
    status: "waiting",
    media: fault.media,
  });

  // 🔄 Convert fault
  fault.status = "convertedToTask";
  fault.assignedTo = selectedTech._id;
  await fault.save();

  // 🔔 Notify technician (ISOLATED — will NOT break conversion)
  try {
    await sendNotification({
      recipients: [selectedTech._id],
      type: "task-assigned",
      message: `New task assigned for equipment: ${fault.equipment?.name}`,
      metadata: { taskId: task._id },
    });
  } catch (notifyErr) {
    console.error("Technician notification failed:", notifyErr.message);
    // Do NOT throw — task is already created successfully
  }

  return task;
};

export default convertFaultToTask;
