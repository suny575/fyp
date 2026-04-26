import Fault from "../models/Fault.js";
import User from "../models/user.js";
import Equipment from "../models/equipment.js";
import convertFaultToTask from "../services/assignment.service.js";
import { sendNotification } from "../services/notification.service.js";
import {
  resolveHospitalName,
  withHospitalScope,
} from "../utils/hospitalScope.js";

const normalizeUploadPath = (filePath) => {
  if (!filePath) return "";

  const normalizedPath = filePath.replace(/\\/g, "/");
  return normalizedPath.startsWith("/")
    ? normalizedPath
    : `/${normalizedPath}`;
};

export const getFaults = async (req, res) => {
  try {
    const faults = await Fault.find(withHospitalScope({}, req.user.hospital))
      .sort({ createdAt: -1 })
      .populate("equipment", "name department hospital")
      .populate("reportedBy", "name hospital")
      .populate("assignedTo", "name hospital")
      .populate("updatedBy", "name hospital");

    const faultsWithUpdatedBy = faults.map((fault) => ({
      ...fault.toObject(),
      updatedByName: fault.updatedBy ? fault.updatedBy.name : "-",
    }));

    res.json(faultsWithUpdatedBy);
  } catch (err) {
    console.error("Error fetching faults:", err);
    res.status(500).json({ message: "Server error fetching faults" });
  }
};

export const submitFault = async (req, res) => {
  try {
    const { equipment, description, priority } = req.body;
    const reportedBy = req.user._id;
    const hospital = resolveHospitalName(req.user.hospital);

    if (!equipment || !description) {
      return res
        .status(400)
        .json({ message: "Equipment & description required" });
    }

    const attachments = req.files || {};
    const images =
      attachments.images?.map((file) => normalizeUploadPath(file.path)) || [];
    const voiceNote = normalizeUploadPath(
      attachments.voiceNote?.[0]?.path || "",
    );

    const equipmentObj = await Equipment.findOne(
      withHospitalScope({ _id: equipment }, hospital),
    );

    if (!equipmentObj) {
      return res.status(404).json({
        message: "Equipment not found for your hospital",
      });
    }

    if (equipmentObj.status === "under_maintenance") {
      return res.status(400).json({
        message:
          "Equipment is currently under maintenance. Cannot submit fault.",
      });
    }

    const fault = await Fault.create({
      equipment,
      department: equipmentObj.department || "Unknown",
      hospital,
      description,
      priority: priority || "medium",
      reportedBy,
      media: {
        images,
        voiceNote,
      },
      status: "waiting",
    });

    try {
      await sendNotification({
        trigger: "FAULT_REPORTED",
        recipientUsers: [fault.reportedBy],
        payload: {
          faultId: fault._id,
          equipmentName: equipmentObj?.name,
          link: `/faults/${fault._id}`,
        },
      });
    } catch (notifyErr) {
      console.error("Reporter notification failed:", notifyErr.message);
    }

    try {
      const task = await convertFaultToTask(fault._id);

      return res.status(201).json({
        message: "Fault submitted and task created successfully",
        fault,
        task,
      });
    } catch (err) {
      console.error("Conversion failed:", err.message);

      try {
        await sendNotification({
          trigger: "SYSTEM_ERROR",
          recipientUsers: [fault.reportedBy],
          payload: {
            message:
              "Your fault was submitted but system failed to process it. Please retry.",
            faultId: fault._id,
          },
        });
      } catch (notifyErr) {
        console.error("Reporter notification failed:", notifyErr.message);
      }

      try {
        const admins = await User.find(
          withHospitalScope({ role: "admin" }, hospital),
        );

        await sendNotification({
          trigger: "SYSTEM_ERROR",
          recipientUsers: admins.map((admin) => admin._id),
          payload: {
            message: `Fault ${fault._id} failed during conversion.`,
          },
        });
      } catch (notifyErr) {
        console.error("Admin notification failed:", notifyErr.message);
      }

      try {
        await Fault.findByIdAndDelete(fault._id);
      } catch (deleteErr) {
        console.error("Failed to delete faulty record:", deleteErr.message);
      }

      return res.status(500).json({
        message: "Fault saved but system failed during processing.",
        fault,
      });
    }
  } catch (err) {
    console.error("Error submitting fault:", err);
    res.status(500).json({ message: "Server error submitting fault" });
  }
};
