import WorkOrder from "../models/workOrders.js";
import MaintenanceSchedule from "../models/MaintenanceSchedule.js";
import User from "../models/user.js";
import { calculateNextMaintenanceDate } from "../services/calculateNextMaintenance.js";
import { sendNotification } from "../services/notification.service.js"; // ✅ correct import

/**
 * GET all work orders sorted by scheduled date
 */
export const getWorkOrders = async (req, res) => {
  try {
    const workOrders = await WorkOrder.find()
      .populate("schedule")
      .populate("equipment", "name")
      .populate("technician", "name")
      .sort({ scheduledDate: 1 });

    res.json(workOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * INTERNAL: Automatically create a work order from a schedule
 * This should be called when a schedule is created OR when maintenance completes
 */
export const generateWorkOrderFromSchedule = async (scheduleId) => {
  try {
    const schedule =
      await MaintenanceSchedule.findById(scheduleId).populate("equipment");

    if (!schedule) return null;

    // Prevent duplicate work orders for same date
    const existing = await WorkOrder.findOne({
      schedule: schedule._id,
      scheduledDate: schedule.nextMaintenanceDate,
    });

    if (existing) return existing;

    const workOrder = new WorkOrder({
      schedule: schedule._id,
      equipment: schedule.equipment._id,
      scheduledDate: schedule.nextMaintenanceDate,
      status: "pending",
    });

    await workOrder.save();

    return workOrder;
  } catch (error) {
    console.error("WorkOrder generation failed:", error.message);
    return null;
  }
};

/**
 * Assign technician to a work order
 */
export const assignTechnician = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);

    if (!workOrder) {
      return res.status(404).json({ message: "Work order not found" });
    }

    const { technicianId } = req.body;

    const technician = await User.findById(technicianId);

    if (!technician) {
      return res.status(404).json({ message: "Technician not found" });
    }

    workOrder.technician = technician._id;
    workOrder.status = "assigned";

    await workOrder.save();

    await sendNotification({
      trigger: "WORKORDER_CREATED",
      recipientUsers: [maintenanceManager],
      payload: {
        workOrderId: workOrder._id,
        scheduleId: schedule._id,
        link: `/workorders/${workOrder._id}`,
      },
    });

    res.json(workOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/**
 * Update work order status
 * When completed → update schedule + generate next work order
 */
export const updateWorkOrderStatus = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id).populate(
      "schedule",
    );

    if (!workOrder) {
      return res.status(404).json({ message: "Work order not found" });
    }

    const { status } = req.body;

    workOrder.status = status;
    await workOrder.save();

    // Maintenance completed → update next schedule and generate next work order
    if (status === "completed") {
      const schedule = await MaintenanceSchedule.findById(
        workOrder.schedule._id,
      );

      if (schedule) {
        const nextDate = calculateNextMaintenanceDate(
          schedule.nextMaintenanceDate,
          schedule.frequency,
          schedule.customIntervalDays,
        );

        schedule.nextMaintenanceDate = nextDate;

        await schedule.save();

        // 🔥 Generate next work order automatically
        await generateWorkOrderFromSchedule(schedule._id);
      }
    }

    res.json(workOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * Get single work order
 */
export const getWorkOrderById = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id)
      .populate("schedule")
      .populate("equipment")
      .populate("technician");

    if (!workOrder) {
      return res.status(404).json({ message: "Work order not found" });
    }

    res.json(workOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
