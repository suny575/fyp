import cron from "node-cron";
import MaintenanceSchedule from "../models/MaintenanceSchedule.js";
import { generateWorkOrderFromSchedule } from "../controllers/workOrderController.js";

export const startMaintenanceScheduler = () => {
  cron.schedule("0 0 * * *", async () => {
    console.log("Running maintenance scheduler...");

    try {
      const today = new Date();
      const threeDaysLater = new Date();
      threeDaysLater.setDate(today.getDate() + 3);

      const schedules = await MaintenanceSchedule.find();

      for (const schedule of schedules) {
        // Only generate work orders for schedules approaching within 3 days
        if (schedule.nextMaintenanceDate <= threeDaysLater) {
          await generateWorkOrderFromSchedule(schedule._id);
        }
      }
    } catch (error) {
      console.error("Scheduler error:", error.message);
    }
  });
};
