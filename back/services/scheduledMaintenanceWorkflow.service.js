import MaintenanceSchedule from "../models/MaintenanceSchedule.js";

export const SCHEDULED_MAINTENANCE_STATUS = Object.freeze({
  SCHEDULED: "SCHEDULED",
  IN_PROGRESS: "IN_PROGRESS",
  COMPLETED_OK: "COMPLETED_OK",
  COMPLETED_WITH_ISSUES: "COMPLETED_WITH_ISSUES",
  NEEDS_REPAIR: "NEEDS_REPAIR",
});

export const SCHEDULED_MAINTENANCE_RESULT = Object.freeze({
  OK: "OK",
  ISSUES: "ISSUES",
  FAILED: "FAILED",
});

const LEGACY_STATUS_TO_CANONICAL = Object.freeze({
  pending: SCHEDULED_MAINTENANCE_STATUS.SCHEDULED,
  assigned: SCHEDULED_MAINTENANCE_STATUS.SCHEDULED,
  in_progress: SCHEDULED_MAINTENANCE_STATUS.IN_PROGRESS,
  inProgress: SCHEDULED_MAINTENANCE_STATUS.IN_PROGRESS,
  completed: SCHEDULED_MAINTENANCE_STATUS.COMPLETED_OK,
});

const RESULT_TO_STATUS = Object.freeze({
  [SCHEDULED_MAINTENANCE_RESULT.OK]:
    SCHEDULED_MAINTENANCE_STATUS.COMPLETED_OK,
  [SCHEDULED_MAINTENANCE_RESULT.ISSUES]:
    SCHEDULED_MAINTENANCE_STATUS.COMPLETED_WITH_ISSUES,
  [SCHEDULED_MAINTENANCE_RESULT.FAILED]:
    SCHEDULED_MAINTENANCE_STATUS.NEEDS_REPAIR,
});

const TERMINAL_STATUSES = new Set([
  SCHEDULED_MAINTENANCE_STATUS.COMPLETED_OK,
  SCHEDULED_MAINTENANCE_STATUS.COMPLETED_WITH_ISSUES,
  SCHEDULED_MAINTENANCE_STATUS.NEEDS_REPAIR,
]);

export const normalizeScheduledMaintenanceStatus = (status) => {
  if (!status) {
    return null;
  }

  const cleaned = String(status).trim();

  if (Object.values(SCHEDULED_MAINTENANCE_STATUS).includes(cleaned)) {
    return cleaned;
  }

  return LEGACY_STATUS_TO_CANONICAL[cleaned] || null;
};

export const mapResultStatusToMaintenanceStatus = (resultStatus) => {
  if (!resultStatus) {
    return null;
  }

  const cleaned = String(resultStatus).trim().toUpperCase();
  return RESULT_TO_STATUS[cleaned] || null;
};

export const resolveScheduledMaintenanceStatusInput = ({
  status,
  resultStatus,
}) => {
  const mappedFromResult = mapResultStatusToMaintenanceStatus(resultStatus);
  if (mappedFromResult) {
    return mappedFromResult;
  }

  return normalizeScheduledMaintenanceStatus(status);
};

export const isTerminalScheduledMaintenanceStatus = (status) => {
  const normalized = normalizeScheduledMaintenanceStatus(status);
  return normalized ? TERMINAL_STATUSES.has(normalized) : false;
};

export const syncScheduleStatusFromWorkOrder = async ({
  workOrder,
  schedule = null,
  nextStatus,
}) => {
  const normalizedStatus = normalizeScheduledMaintenanceStatus(nextStatus);

  if (!normalizedStatus) {
    throw new Error("Unsupported scheduled maintenance status.");
  }

  if (!workOrder) {
    throw new Error("Work order is required for status sync.");
  }

  let scheduleDoc = schedule;
  if (!scheduleDoc) {
    const scheduleId = workOrder.schedule?._id || workOrder.schedule;
    if (scheduleId) {
      scheduleDoc = await MaintenanceSchedule.findById(scheduleId);
    }
  }

  if (!scheduleDoc) {
    throw new Error("Linked maintenance schedule not found.");
  }

  workOrder.status = normalizedStatus;
  scheduleDoc.status = normalizedStatus;

  await Promise.all([workOrder.save(), scheduleDoc.save()]);

  return {
    workOrder,
    schedule: scheduleDoc,
    status: normalizedStatus,
  };
};
