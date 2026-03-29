import WorkOrder from "../models/workOrders.js";
import MaintenanceSchedule from "../models/MaintenanceSchedule.js";
import User from "../models/user.js";
import { calculateNextMaintenanceDate } from "../services/calculateNextMaintenance.js";
import { sendNotification } from "../services/notification.service.js";
import {
  resolveHospitalName,
  withHospitalScope,
} from "../utils/hospitalScope.js";

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
  workOrder.status = "assigned";
  await workOrder.save();

  await sendNotification({
    trigger: "WORKORDER_CREATED",
    recipientUsers: [technician._id],
    payload: {
      workOrderId: workOrder._id,
      scheduleId: workOrder.schedule,
      link: `/workorders/${workOrder._id}`,
    },
  });

  return workOrder;
};

export const getWorkOrders = async (req, res) => {
  try {
    const workOrders = await WorkOrder.find(
      withHospitalScope({}, req.user.hospital),
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

    if (existing) return existing;

    const workOrder = new WorkOrder({
      schedule: schedule._id,
      equipment: schedule.equipment._id,
      hospital: resolveHospitalName(schedule.hospital, schedule.equipment?.hospital),
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
    ).populate("schedule");

    if (!workOrder) {
      return res.status(404).json({ message: "Work order not found" });
    }

    const { status } = req.body;
    workOrder.status = status;
    await workOrder.save();

    if (status === "completed" && workOrder.schedule?._id) {
      const schedule = await MaintenanceSchedule.findOne(
        withHospitalScope({ _id: workOrder.schedule._id }, req.user.hospital),
      );

      if (schedule) {
        const nextDate = calculateNextMaintenanceDate(
          schedule.nextMaintenanceDate,
          schedule.frequency,
          schedule.customIntervalDays,
        );

        schedule.nextMaintenanceDate = nextDate;
        await schedule.save();
        await generateWorkOrderFromSchedule(schedule._id);
      }
    }

    res.json(workOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
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
