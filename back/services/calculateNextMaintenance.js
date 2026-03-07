export const calculateNextMaintenanceDate = (
  startDate,
  frequency,
  customIntervalDays,
) => {
  const date = new Date(startDate);

  switch (frequency) {
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;

    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;

    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;

    case "custom":
      date.setDate(date.getDate() + customIntervalDays);
      break;

    default:
      break;
  }

  return date;
};