import WorkOrder from "../models/workOrders.js";
import MaintenanceSchedule from "../models/MaintenanceSchedule.js";
import User from "../models/user.js";
import Equipment from "../models/equipment.js";
import { sendNotification } from "../services/notification.service.js";
import {
  isTerminalScheduledMaintenanceStatus,
  normalizeScheduledMaintenanceStatus,
  resolveScheduledMaintenanceStatusInput,
  SCHEDULED_MAINTENANCE_STATUS,
  syncScheduleStatusFromWorkOrder,
} from "../services/scheduledMaintenanceWorkflow.service.js";
import {
  resolveHospitalName,
  withHospitalScope,
} from "../utils/hospitalScope.js";

const createHttpError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const getTechnicianId = (workOrder) => {
  if (!workOrder?.technician) {
    return "";
  }

  if (typeof workOrder.technician === "object" && workOrder.technician?._id) {
    return workOrder.technician._id.toString();
  }

  return workOrder.technician.toString();
};

const notifyScheduledMaintenanceStatusChange = async ({
  workOrder,
  schedule,
  actor,
  resultStatus,
}) => {
  try {
    const hospital = resolveHospitalName(
      workOrder?.hospital,
      schedule?.hospital,
      actor?.hospital,
    );

    const managers = await User.find(
      withHospitalScope({ role: "maintenanceManager" }, hospital),
    ).select("_id");

    if (!managers.length) {
      return;
    }

    const equipmentDoc =
      typeof workOrder.equipment === "object" && workOrder.equipment?.name
        ? workOrder.equipment
        : await Equipment.findById(workOrder.equipment).select("name");

    const scheduleId = schedule?._id || workOrder.schedule?._id || workOrder.schedule;

    await sendNotification({
      trigger: "SCHEDULE_STATUS_UPDATED",
      recipientUsers: managers.map((manager) => manager._id),
      payload: {
        scheduleId,
        workOrderId: workOrder._id,
        equipmentName: equipmentDoc?.name || "equipment",
        status: normalizeScheduledMaintenanceStatus(workOrder.status),
        resultStatus: resultStatus ? String(resultStatus).trim().toUpperCase() : null,
        updatedBy: actor?.name || "Technician",
        link: `/schedules/${scheduleId}`,
      },
    });
  } catch (error) {
    console.error(
      "Scheduled maintenance status notification failed:",
      error.message,
    );
  }
};

const validateTechnicianAccess = (workOrder, user) => {
  if (user?.role !== "technician") {
    return;
  }

  const assignedTechnicianId = getTechnicianId(workOrder);
  if (!assignedTechnicianId) {
    throw createHttpError(
      "This scheduled task has not been assigned to any technician.",
      403,
    );
  }

  if (assignedTechnicianId !== user._id.toString()) {
    throw createHttpError(
      "You can only update your assigned scheduled tasks.",
      403,
    );
  }
};

const applyScheduledMaintenanceStatusUpdate = async ({
  workOrder,
  user,
  status,
  resultStatus,
}) => {
  const targetStatus = resolveScheduledMaintenanceStatusInput({
    status,
    resultStatus,
  });

  if (!targetStatus) {
    throw createHttpError(
      "Invalid status update. Use status or resultStatus for scheduled maintenance.",
      400,
    );
  }

  const currentStatus =
    normalizeScheduledMaintenanceStatus(workOrder.status) ||
    SCHEDULED_MAINTENANCE_STATUS.SCHEDULED;

  if (
    isTerminalScheduledMaintenanceStatus(currentStatus) &&
    targetStatus !== currentStatus
  ) {
    throw createHttpError("Completed scheduled tasks cannot be changed.", 400);
  }

  const scheduleDoc =
    workOrder.schedule &&
    typeof workOrder.schedule === "object" &&
    typeof workOrder.schedule.save === "function"
      ? workOrder.schedule
      : null;

  const { workOrder: updatedWorkOrder, schedule } =
    await syncScheduleStatusFromWorkOrder({
      workOrder,
      schedule: scheduleDoc,
      nextStatus: targetStatus,
    });

  await notifyScheduledMaintenanceStatusChange({
    workOrder: updatedWorkOrder,
    schedule,
    actor: user,
    resultStatus,
  });

  return updatedWorkOrder;
};

const assignTechnicianToOrder = async (workOrder, technicianId, hospital) => {
  const technician = await User.findOne(
    withHospitalScope(
      {
        _id: technicianId,
        role: "technician",
        status: { $ne: "inactive" },
      },
      hospital,
    ),
  );

  if (!technician) {
    throw new Error("Technician not found");
  }

  workOrder.technician = technician._id;

  const normalizedStatus =
    normalizeScheduledMaintenanceStatus(workOrder.status) ||
    SCHEDULED_MAINTENANCE_STATUS.SCHEDULED;

  workOrder.status = normalizedStatus;
  await workOrder.save();

  const scheduleId = workOrder.schedule?._id || workOrder.schedule;
  if (scheduleId) {
    const schedule = await MaintenanceSchedule.findById(scheduleId);
    if (schedule && schedule.status !== normalizedStatus) {
      schedule.status = normalizedStatus;
      await schedule.save();
    }
  }

  const equipmentDoc =
    typeof workOrder.equipment === "object" && workOrder.equipment?.name
      ? workOrder.equipment
      : await Equipment.findById(workOrder.equipment).select("name");

  await sendNotification({
    trigger: "WORKORDER_ASSIGNED",
    recipientUsers: [technician._id],
    payload: {
      workOrderId: workOrder._id,
      scheduleId: workOrder.schedule,
      equipmentName: equipmentDoc?.name || "equipment",
      scheduledDate: workOrder.scheduledDate
        ? new Date(workOrder.scheduledDate).toLocaleDateString()
        : "N/A",
      link: `/workorders/${workOrder._id}`,
    },
  });

  return workOrder;
};

export const getWorkOrders = async (req, res) => {
  try {
    const baseFilter =
      req.user?.role === "technician"
        ? { technician: req.user._id }
        : {};

    const workOrders = await WorkOrder.find(
      withHospitalScope(baseFilter, req.user.hospital),
    )
      .populate("schedule")
      .populate("equipment", "name department hospital")
      .populate("technician", "name hospital")
      .sort({ scheduledDate: 1 });

    res.json(workOrders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const generateWorkOrderFromSchedule = async (scheduleId) => {
  try {
    const schedule = await MaintenanceSchedule.findById(scheduleId).populate(
      "equipment",
    );

    if (!schedule) return null;

    const existing = await WorkOrder.findOne({
      schedule: schedule._id,
      scheduledDate: schedule.nextMaintenanceDate,
    });

    if (existing) {
      const normalizedExistingStatus =
        normalizeScheduledMaintenanceStatus(existing.status) ||
        SCHEDULED_MAINTENANCE_STATUS.SCHEDULED;

      if (existing.status !== normalizedExistingStatus) {
        existing.status = normalizedExistingStatus;
        await existing.save();
      }

      if (schedule.status !== normalizedExistingStatus) {
        schedule.status = normalizedExistingStatus;
        await schedule.save();
      }

      return existing;
    }

    const workOrder = new WorkOrder({
      schedule: schedule._id,
      equipment: schedule.equipment._id,
      hospital: resolveHospitalName(schedule.hospital, schedule.equipment?.hospital),
      scheduledDate: schedule.nextMaintenanceDate,
      status: SCHEDULED_MAINTENANCE_STATUS.SCHEDULED,
    });

    await workOrder.save();

    if (schedule.status !== SCHEDULED_MAINTENANCE_STATUS.SCHEDULED) {
      schedule.status = SCHEDULED_MAINTENANCE_STATUS.SCHEDULED;
      await schedule.save();
    }

    return workOrder;
  } catch (error) {
    console.error("WorkOrder generation failed:", error.message);
    return null;
  }
};

export const assignTechnician = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findOne(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
    );

    if (!workOrder) {
      return res.status(404).json({ message: "Work order not found" });
    }

    const { technicianId } = req.body;
    const updatedWorkOrder = await assignTechnicianToOrder(
      workOrder,
      technicianId,
      req.user.hospital,
    );

    res.json(updatedWorkOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const assignTechnicianBySchedule = async (req, res) => {
  try {
    const schedule = await MaintenanceSchedule.findOne(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
    );

    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }

    let workOrder = await WorkOrder.findOne(
      withHospitalScope(
        {
          schedule: schedule._id,
          scheduledDate: schedule.nextMaintenanceDate,
        },
        req.user.hospital,
      ),
    );

    if (!workOrder) {
      workOrder = await generateWorkOrderFromSchedule(schedule._id);
    }

    if (!workOrder) {
      return res
        .status(500)
        .json({ message: "Unable to create or find work order" });
    }

    const updatedWorkOrder = await assignTechnicianToOrder(
      workOrder,
      req.body.technicianId,
      req.user.hospital,
    );

    res.json(updatedWorkOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const updateWorkOrderStatus = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findOne(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
    )
      .populate("schedule")
      .populate("equipment", "name hospital")
      .populate("technician", "name hospital");

    if (!workOrder) {
      return res.status(404).json({ message: "Work order not found" });
    }

    validateTechnicianAccess(workOrder, req.user);

    const { status, resultStatus } = req.body;
    if (!status && !resultStatus) {
      return res.status(400).json({
        message: "Either status or resultStatus is required.",
      });
    }

    const updatedWorkOrder = await applyScheduledMaintenanceStatusUpdate({
      workOrder,
      user: req.user,
      status,
      resultStatus,
    });

    res.json(updatedWorkOrder);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const startMaintenance = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findOne(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
    )
      .populate("schedule")
      .populate("equipment", "name hospital")
      .populate("technician", "name hospital");

    if (!workOrder) {
      return res.status(404).json({ message: "Work order not found" });
    }

    validateTechnicianAccess(workOrder, req.user);

    const updatedWorkOrder = await applyScheduledMaintenanceStatusUpdate({
      workOrder,
      user: req.user,
      status: SCHEDULED_MAINTENANCE_STATUS.IN_PROGRESS,
    });

    res.json(updatedWorkOrder);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const submitMaintenanceResult = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findOne(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
    )
      .populate("schedule")
      .populate("equipment", "name hospital")
      .populate("technician", "name hospital");

    if (!workOrder) {
      return res.status(404).json({ message: "Work order not found" });
    }

    validateTechnicianAccess(workOrder, req.user);

    const { resultStatus } = req.body;
    if (!resultStatus) {
      return res.status(400).json({
        message: "resultStatus is required. Allowed: OK, ISSUES, FAILED.",
      });
    }

    const updatedWorkOrder = await applyScheduledMaintenanceStatusUpdate({
      workOrder,
      user: req.user,
      resultStatus,
    });

    res.json(updatedWorkOrder);
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

export const getWorkOrderById = async (req, res) => {
  try {
    const workOrder = await WorkOrder.findOne(
      withHospitalScope({ _id: req.params.id }, req.user.hospital),
    )
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
