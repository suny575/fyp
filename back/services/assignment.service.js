import User from "../models/user.js";
import Task from "../models/Task.js";
import Fault from "../models/Fault.js";
import { sendNotification } from "../services/notification.service.js";
import {
  resolveHospitalName,
  withHospitalScope,
} from "../utils/hospitalScope.js";

const convertFaultToTask = async (faultId) => {
  const fault = await Fault.findById(faultId)
    .populate("reportedBy")
    .populate("equipment");

  if (!fault) throw new Error("Fault not found");
  if (fault.status !== "waiting") throw new Error("Fault already processed");

  const hospital = resolveHospitalName(
    fault.hospital,
    fault.reportedBy?.hospital,
    fault.equipment?.hospital,
  );

  const technicians = await User.find(
    withHospitalScope(
      { role: "technician", status: { $ne: "inactive" } },
      hospital,
    ),
  );

  if (!technicians.length) {
    throw new Error("No technicians available in this hospital");
  }

  let minTasks = Infinity;
  let selectedTech = null;

  for (const tech of technicians) {
    const count = await Task.countDocuments(
      withHospitalScope(
        {
          assignedTechnician: tech._id,
          status: { $in: ["waiting", "inProgress"] },
        },
        hospital,
      ),
    );

    if (count < minTasks) {
      minTasks = count;
      selectedTech = tech;
    }
  }

  if (!selectedTech) throw new Error("Technician selection failed");

  const task = await Task.create({
    name: `Maintenance: ${fault.description.substring(0, 30)}`,
    equipment: fault.equipment,
    department: fault.department,
    hospital,
    description: fault.description,
    priority: fault.priority,
    assignedTechnician: selectedTech._id,
    faultRef: fault._id,
    reportedBy: fault.reportedBy._id,
    status: "waiting",
    media: fault.media,
  });

  fault.hospital = hospital;
  fault.status = "convertedToTask";
  fault.assignedTo = selectedTech._id;
  await fault.save();

  try {
    await sendNotification({
      trigger: "TASK_CREATED",
      recipientUsers: [task.assignedTechnician],
      payload: {
        workOrderId: task._id,
        equipmentName: fault?.equipment?.name || "Equipment",
        link: `/tasks/${task._id}`,
      },
    });
  } catch (notifyErr) {
    console.error("Technician notification failed:", notifyErr.message);
  }

  return task;
};

export default convertFaultToTask;
