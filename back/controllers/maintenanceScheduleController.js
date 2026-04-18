import MaintenanceSchedule from "../models/MaintenanceSchedule.js";
import WorkOrder from "../models/workOrders.js";
import Equipment from "../models/equipment.js";
import User from "../models/user.js";
import { calculateNextMaintenanceDate } from "../services/calculateNextMaintenance.js";
import { generateWorkOrderFromSchedule } from "./workOrderController.js";
import { sendNotification } from "../services/notification.service.js";
import {
  normalizeScheduledMaintenanceStatus,
  SCHEDULED_MAINTENANCE_STATUS,
} from "../services/scheduledMaintenanceWorkflow.service.js";
import {
  resolveHospitalName,
  withHospitalScope,
} from "../utils/hospitalScope.js";

const attachCurrentWorkOrderStatus = async (schedules, hospital) => {
  if (!schedules.length) return schedules;

  const scheduleIds = schedules.map((schedule) => schedule._id);
  const workOrders = await WorkOrder.find(
    withHospitalScope({ schedule: { $in: scheduleIds } }, hospital),
  )
    .sort({ createdAt: -1 })
    .lean();

  const workOrdersBySchedule = new Map();

  workOrders.forEach((workOrder) => {
    const scheduleId = workOrder.schedule?.toString();
    if (!scheduleId) return;

    const existingOrders = workOrdersBySchedule.get(scheduleId) || [];
    existingOrders.push(workOrder);
    workOrdersBySchedule.set(scheduleId, existingOrders);
  });

  return schedules.map((schedule) => {
    const scheduleId = schedule._id.toString();
    const currentScheduleDate = new Date(schedule.nextMaintenanceDate).getTime();
    const relatedOrders = workOrdersBySchedule.get(scheduleId) || [];

    const currentWorkOrder =
      relatedOrders.find(
        (workOrder) =>
          workOrder.scheduledDate &&
          new Date(workOrder.scheduledDate).getTime() === currentScheduleDate,
      ) ||
      relatedOrders[0] ||
      null;

    const normalizedScheduleStatus = normalizeScheduledMaintenanceStatus(
      schedule.status,
    );
    const normalizedWorkOrderStatus = normalizeScheduledMaintenanceStatus(
      currentWorkOrder?.status,
    );

    return {
      ...schedule,
      status:
        normalizedScheduleStatus ||
        normalizedWorkOrderStatus ||
        SCHEDULED_MAINTENANCE_STATUS.SCHEDULED,
      workOrderId: currentWorkOrder?._id || null,
      technician: currentWorkOrder?.technician || null,
    };
  });
};

export const getUpcomingSchedules = async (req, res) => {
  try {
    const schedules = await MaintenanceSchedule.find(
      withHospitalScope({}, req.user.hospital),
    )
      .populate("equipment", "name department hospital")
      .populate("createdBy", "name hospital")
      .sort({ nextMaintenanceDate: 1 })
      .lean();

    const schedulesWithStatus = await attachCurrentWorkOrderStatus(
      schedules,
      req.user.hospital,
    );

    res.json(schedulesWithStatus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createSchedule = async (req, res) => {
  try {
    const { equipment, frequency, startDate, customIntervalDays, priority } =
      req.body;

    const existingSchedule = await MaintenanceSchedule.findOne(
      withHospitalScope({ equipment }, req.user.hospital),
    ).lean();

    if (existingSchedule) {
      return res.status(409).json({
        message: "A maintenance schedule already exists for this equipment.",
      });
    }

    const equipmentDoc = await Equipment.findOne(
      withHospitalScope({ _id: equipment }, req.user.hospital),
    );

    if (!equipmentDoc) {
      return res
        .status(404)
        .json({ message: "Equipment not found for your hospital" });
    }

    const nextMaintenanceDate = calculateNextMaintenanceDate(
      startDate,
      frequency,
      customIntervalDays || null,
    );

    const hospital = resolveHospitalName(req.user.hospital, equipmentDoc.hospital);

    const schedule = new MaintenanceSchedule({
      equipment,
      frequency,
      startDate,
      customIntervalDays,
      priority,
      hospital,
      nextMaintenanceDate,
      status: SCHEDULED_MAINTENANCE_STATUS.SCHEDULED,
      createdBy: req.user._id,
    });

    await schedule.save();

    const managers = await User.find(
      withHospitalScope({ role: "maintenanceManager" }, hospital),
    );

    if (managers.length) {
      await sendNotification({
        trigger: "SCHEDULE_CREATED",
        recipientUsers: managers.map((manager) => manager._id),
        payload: {
          scheduleId: schedule._id,
          equipmentName: equipmentDoc.name,
          link: `/schedules/${schedule._id}`,
        },
      });
    }

    await generateWorkOrderFromSchedule(schedule._id);
    res.status(201).json(schedule);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const getScheduleById = async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.findOne(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
    )
      .populate("equipment")
      .populate("createdBy")
      .lean();
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    const [scheduleWithStatus] = await attachCurrentWorkOrderStatus(
      [schedule],
      req.user.hospital,
    );

    res.json(scheduleWithStatus);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
