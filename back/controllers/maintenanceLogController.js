import MaintenanceLog from "../models/maintenanceLog.js";
import WorkOrder from "../models/workOrders.js";
import {
  SCHEDULED_MAINTENANCE_STATUS,
  syncScheduleStatusFromWorkOrder,
} from "../services/scheduledMaintenanceWorkflow.service.js";

export const getLogs = async (req, res) => {
  try {
    const logs = await MaintenanceLog.find()
      .populate("workOrder")
      .populate("schedule")
      .populate("equipment")
      .populate("technician")
      .sort({ completionDate: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createLog = async (req, res) => {
  try {
    const log = new MaintenanceLog(req.body);

    // Keep scheduled-maintenance status in sync when logs finalize work.
    if (log.workOrder && ["completed", "failed"].includes(log.status)) {
      const workOrder = await WorkOrder.findById(log.workOrder);
      if (workOrder) {
        const mappedStatus =
          log.status === "completed"
            ? SCHEDULED_MAINTENANCE_STATUS.COMPLETED_OK
            : SCHEDULED_MAINTENANCE_STATUS.NEEDS_REPAIR;

        await syncScheduleStatusFromWorkOrder({
          workOrder,
          nextStatus: mappedStatus,
        });
      }
    }

    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getLogById = async (req, res) => {
  try {
    const log = await MaintenanceLog.findById(req.params.id)
      .populate("workOrder")
      .populate("schedule")
      .populate("equipment")
      .populate("technician");
    if (!log) return res.status(404).json({ message: "Log not found" });
    res.json(log);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
