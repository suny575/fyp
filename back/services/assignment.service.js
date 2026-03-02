import User from "../models/user.js";
import Task from "../models/Task.js";
import Fault from "../models/Fault.js";

/**
 * Converts a fault into a task and assigns least busy technician
 */
const convertFaultToTask = async (faultId) => {
  // 1️⃣ Get fault
  const fault = await Fault.findById(faultId);
  if (!fault) throw new Error("Fault not found");

  // 2️⃣ Find technicians
  const technicians = await User.find({ role: "technician" });
  if (!technicians.length) throw new Error("No technicians available");

  let minAssigned = Infinity;
  let selectedTech = null;

  for (const tech of technicians) {
    const assignedTasks = await Task.countDocuments({
      assignedTechnician: tech._id,
      status: { $in: ["waiting", "in_progress"] },
    });

    if (assignedTasks < minAssigned) {
      minAssigned = assignedTasks;
      selectedTech = tech;
    }
  }

  if (!selectedTech) throw new Error("No technician selected");

  // 3️⃣ Update fault status
  fault.status = "waiting";
  await fault.save();

  // 4️⃣ Create task
  const task = await Task.create({
    name: `Maintenance: ${fault.description.substring(0, 30)}`,
    description: fault.description,
    department: fault.department,
    priority: fault.priority,
    assignedTechnician: selectedTech._id,
    faultRef: fault._id,
    createdBy: fault.reportedBy,
  });

  return task;
};

export default convertFaultToTask;