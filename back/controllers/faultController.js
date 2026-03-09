import Fault from "../models/Fault.js";
import Task from "../models/Task.js";
import User from "../models/user.js";
import Equipment from "../models/equipment.js";
import convertFaultToTask from "../services/assignment.service.js";
import { sendNotification } from "../services/notification.service.js"; // ✅ correct import

// GET ALL FAULTS
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

// SUBMIT FAULT (POST)
export const submitFault = async (req, res) => {
  try {
    const { equipment, description, priority } = req.body;
    const reportedBy = req.user._id;

    if (!equipment || !description) {
      return res
        .status(400)
        .json({ message: "Equipment & description required" });
    }

    const attachments = req.files || {};
    const images =
      attachments.images?.map((f) => f.path.replace(/\\/g, "/")) || [];
    const voiceNote =
      attachments.voiceNote?.[0]?.path.replace(/\\/g, "/") || "";

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

    const equipmentObj = await Equipment.findById(equipment);
    const department = equipmentObj?.department || "Unknown";

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

    //send confirmation msg to reporter

    //     try {
    //       await sendNotification({
    //         trigger: "FAULT_REPORTED",
    //         recipientUsers: [fault.reportedBy],
    //         payload: {
    //           faultId: fault._id,
    //           equipmentName: fault.equipment.name,
    //           link: `/faults/${fault._id}`,
    //         },
    //       });
    //       const task = await convertFaultToTask(fault._id);

    //       return res.status(201).json({
    //         message: "Fault submitted and task created successfully",
    //         fault,
    //         task,
    //       });
    //     } catch (err) {
    //       console.error("Conversion failed:", err.message);

    //       // Notify reporter
    //       try {
    //         await sendNotification({
    //           recipients: [fault.reportedBy],
    //           type: "system-error",
    //           message:
    //             "Your fault was submitted but system failed to process it. Admin has been notified.",
    //           metadata: { faultId: fault._id },
    //         });
    //       } catch (e) {
    //         console.error("Reporter notification failed");
    //       }

    //       // Notify admin
    //       try {
    //         const admins = await User.find({ role: "admin" });
    //         await sendNotification({
    //           recipients: admins.map((a) => a._id),
    //           type: "system-error",
    //           message: `Fault ${fault._id} failed during conversion.`,
    //         });
    //       } catch (e) {
    //         console.error("Admin notification failed");
    //       }

    //       return res.status(500).json({
    //         message: "Fault saved but system failed during processing.",
    //         fault,
    //       });
    //     }
    //   } catch (err) {
    //     console.error("Error submitting fault:", err);
    //     res.status(500).json({ message: "Server error submitting fault" });
    //   }
    // };

    // Send confirmation notification to reporter (NON BLOCKING)
    try {
      sendNotification({
        trigger: "FAULT_REPORTED",
        recipientUsers: [fault.reportedBy],
        payload: {
          faultId: fault._id,
          equipmentName: equipmentObj?.name,
          link: `/faults/${fault._id}`,
        },
      });
    } catch (e) {
      console.error("Reporter notification failed");
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

      // Notify reporter
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
      } catch (e) {
        console.error("Reporter notification failed");
      }

      // Notify admin
      try {
        const admins = await User.find({ role: "admin" });

        await sendNotification({
          trigger: "SYSTEM_ERROR",
          recipientUsers: admins.map((a) => a._id),
          payload: {
            message: `Fault ${fault._id} failed during conversion.`,
          },
        });
      } catch (e) {
        console.error("Admin notification failed");
      }

      // Delete fault so reporter can resubmit
      try {
        await Fault.findByIdAndDelete(fault._id);
      } catch (e) {
        console.error("Failed to delete faulty record");
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
