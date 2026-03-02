import Fault from "../models/Fault.js";
import Task from "../models/Task.js";
import User from "../models/user.js";
import Equipment from "../models/equipment.js";
import sendNotification from "../services/notification.service.js";

// ===============================
// GET ALL FAULTS
// ===============================
export const getFaults = async (req, res) => {
  try {
    const faults = await Fault.find()
      .sort({ createdAt: -1 })
      .populate("equipment", "name")
      .populate("department", "name")
      .populate("reportedBy", "name")
      .populate("assignedTo", "name")
      .populate("updatedBy", "name");

    const faultsWithUpdatedBy = faults.map((f) => ({
      ...f.toObject(),
      updatedByName: f.updatedBy ? f.updatedBy.name : "-",
    }));

    res.json(faultsWithUpdatedBy);
  } catch (err) {
    console.error("Error fetching faults:", err);
    res.status(500).json({ message: "Server error fetching faults" });
  }
};

// ===============================
// HELPER: LEAST BUSY TECHNICIAN
// ===============================
const getAvailableTechnician = async () => {
  const techs = await User.find({ role: "technician" });

  if (!techs.length) return null;

  techs.sort(
    (a, b) => (a.totalAssignedTasks || 0) - (b.totalAssignedTasks || 0),
  );

  return techs[0];
};

// ===============================
// SUBMIT FAULT (POST)
// ===============================
export const submitFault = async (req, res) => {
  try {
    const { equipment, description, priority } = req.body;
    const reportedBy = req.user._id;

    if (!equipment || !description)
      return res
        .status(400)
        .json({ message: "Equipment & description required" });

    // Multer files
    const attachments = req.files || {};
    const images = attachments.images?.map((f) => f.path) || [];
    const voiceNote = attachments.voiceNote?.[0]?.path || "";

    // Prevent duplicate active fault
    const existingFault = await Fault.findOne({
      equipment,
      status: { $in: ["pending", "in-progress", "waiting"] },
    });

    if (existingFault) {
      return res.status(400).json({
        message: "Similar fault already reported",
        faultId: existingFault._id,
      });
    }

    // 🔥 STEP 0: Get department from equipment
    const equipmentObj = await Equipment.findById(equipment);
    const department = equipmentObj?.department || "Unknown";

    // 🔥 STEP 1: Create Fault
    const fault = await Fault.create({
      equipment,
      department,
      description,
      priority: priority || "medium",
      reportedBy,
      media: {
        images,
        voiceNote,
      },
      status: "waiting",
    });

    // 🔥 STEP 2: Assign Least Busy Technician
    const tech = await getAvailableTechnician();

    if (tech) {
      fault.assignedTo = tech._id;
      await fault.save();

      // increment technician workload
      tech.totalAssignedTasks = (tech.totalAssignedTasks || 0) + 1;
      await tech.save();
    }

    // 🔥 STEP 3: Create Maintenance Task
    const task = await Task.create({
      title: `Maintenance: ${description.substring(0, 30)}`,
      name: `Maintenance Task for ${equipmentObj.name}`, // fill name
      equipmentRef: equipment,
      faultRef: fault._id,
      assignedTechnician: tech ? tech._id : null, // fix assignedTechnician
      createdBy: reportedBy, // fix createdBy
      department: department, // fix department
      description, // fix description
      priority: priority || "medium",
      status: "waiting", // match enum in schema
    });

    // 🔥 STEP 4: Send Notifications
    const managers = await User.find({ role: "manager" });
    const reporter = await User.findById(reportedBy);

    const recipients = [reporter, ...managers];
    if (tech) recipients.push(tech);

    res.status(201).json({
      message: "Fault submitted successfully",
      fault,
      task,
    });

    await sendNotification({
      recipients,
      type: "task-assigned",
      message: tech
        ? `Task assigned to ${tech.name}`
        : `New fault reported. Awaiting technician assignment.`,
      metadata: { taskId: task._id, faultId: fault._id },
    });
  } catch (err) {
    console.error("Fault submission error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
