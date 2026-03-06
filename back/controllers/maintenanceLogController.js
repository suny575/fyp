import MaintenanceLog from "../models/MaintenanceLog.js";
import WorkOrder from "../models/workOrders.js";

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

    // Update related work order status if completed
    if (log.status === "completed" && log.workOrder) {
      const workOrder = await WorkOrder.findById(log.workOrder);
      if (workOrder) {
        workOrder.status = "completed";
        await workOrder.save();
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
