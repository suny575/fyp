import WorkOrder from "../models/workOrders.js";
import MaintenanceSchedule from "../models/MaintenanceSchedule.js";
import Equipment from "../models/equipment.js";
import User from "../models/user.js";

export const getWorkOrders = async (req, res) => {
  try {
    const workOrders = await WorkOrder.find()
      .populate("schedule")
      .populate("equipment")
      .populate("technician")
      .sort({ scheduledDate: 1 });
    res.json(workOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createWorkOrder = async (req, res) => {
  try {
    const { scheduleId } = req.body;
    const schedule =
      await MaintenanceSchedule.findById(scheduleId).populate("equipment");
    if (!schedule)
      return res.status(404).json({ message: "Schedule not found" });

    const workOrder = new WorkOrder({
      schedule: schedule._id,
      equipment: schedule.equipment._id,
      scheduledDate: schedule.nextMaintenanceDate,
    });

    await workOrder.save();
    res.status(201).json(workOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const assignTechnician = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id);
    if (!workOrder)
      return res.status(404).json({ message: "Work order not found" });

    const { technicianId } = req.body;
    const technician = await User.findById(technicianId);
    if (!technician)
      return res.status(404).json({ message: "Technician not found" });

    workOrder.technician = technician._id;
    workOrder.status = "assigned";
    await workOrder.save();

    res.json(workOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getWorkOrderById = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findById(req.params.id)
      .populate("schedule")
      .populate("equipment")
      .populate("technician");
    if (!workOrder)
      return res.status(404).json({ message: "Work order not found" });
    res.json(workOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
