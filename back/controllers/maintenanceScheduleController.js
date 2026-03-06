import MaintenanceSchedule from "../models/MaintenanceSchedule.js";
import Equipment from "../models/Equipment.js";

export const getUpcomingSchedules = async (req, res) => {
  try {
    const schedules = await MaintenanceSchedule.find()
      .populate("equipment")
      .populate("createdBy")
      .sort({ nextMaintenanceDate: 1 });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const schedule = new MaintenanceSchedule(req.body);
    await schedule.save();
    res.status(201).json(schedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getScheduleById = async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.findById(req.params.id)
      .populate("equipment")
      .populate("createdBy");
    if (!schedule)
      return res.status(404).json({ message: "Schedule not found" });
    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
