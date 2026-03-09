import MaintenanceSchedule from "../models/MaintenanceSchedule.js";
import { calculateNextMaintenanceDate } from "../services/calculateNextMaintenance.js";
import { generateWorkOrderFromSchedule } from "./workOrderController.js";
import { sendNotification } from "../services/notification.service.js"; // ✅ correct import

export const getUpcomingSchedules = async (req, res) => {
  try {
    const schedules = await MaintenanceSchedule.find()
      .populate("equipment", "name")
      .populate("createdBy", "name")
      .sort({ nextMaintenanceDate: 1 });
    res.json(schedules);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSchedule = async (req, res) => {
  try {
    console.log("Incoming data:", req.body);

    const { equipment, frequency, startDate, customIntervalDays, priority } =
      req.body;

    const nextMaintenanceDate = calculateNextMaintenanceDate(
      startDate,
      frequency,
      customIntervalDays || null,
    );

    const schedule = new MaintenanceSchedule({
      equipment,
      frequency,
      startDate,
      customIntervalDays,
      priority,
      nextMaintenanceDate,
      createdBy: req.user._id,
    });

    await schedule.save();
//optional but
await sendNotification({
  trigger: "SCHEDULE_CREATED",
  recipientUsers: [maintenanceManager],
  payload: {
    scheduleId: schedule._id,
    equipmentName: schedule.equipment.name,
    link: `/schedules/${schedule._id}`
  }
});

    await generateWorkOrderFromSchedule(schedule._id);
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
