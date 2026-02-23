const express = require("express");
const router = express.Router();
const Equipment = require("../models/Equipment");
const ScheduledMaintenance = require("../models/ScheduledMaintenance");
const Notification = require("../models/Notification");

// Utility function to calculate next maintenance date
const calculateNextDate = (interval) => {
  const now = new Date();
  if (interval === "daily") now.setDate(now.getDate() + 1);
  if (interval === "weekly") now.setDate(now.getDate() + 7);
  if (interval === "monthly") now.setMonth(now.getMonth() + 1);
  return now;
};

// Wrap router in a function so we can pass `io` from server.js
module.exports = (io, onlineUsers) => {
  router.patch("/:id/maintenance", async (req, res) => {
    try {
      const { maintenanceInterval, technicianId, managerId } = req.body;

      const equipment = await Equipment.findById(req.params.id);
      if (!equipment)
        return res.status(404).json({ message: "Equipment not found" });

      // 1️⃣ Update Equipment
      equipment.maintenanceInterval = maintenanceInterval;
      await equipment.save();

      // 2️⃣ Create Scheduled Maintenance
      const scheduled = await ScheduledMaintenance.create({
        equipment: equipment._id,
        interval: maintenanceInterval,
        nextDate: calculateNextDate(maintenanceInterval),
        status: "upcoming",
      });

      // 3️⃣ Notify Technician
      if (technicianId && onlineUsers[technicianId]) {
        io.to(onlineUsers[technicianId]).emit("notification", {
          message: `Maintenance scheduled for ${equipment.name}`,
        });
      }

      await Notification.create({
        role: "technician",
        message: `Maintenance scheduled for ${equipment.name}`,
        relatedId: scheduled._id,
      });

      // 4️⃣ Notify Manager (self confirmation)
      if (managerId && onlineUsers[managerId]) {
        io.to(onlineUsers[managerId]).emit("notification", {
          message: `You scheduled maintenance for ${equipment.name}`,
        });
      }

      await Notification.create({
        role: "manager",
        message: `You scheduled maintenance for ${equipment.name}`,
        relatedId: scheduled._id,
      });

      res.json({ message: "Maintenance scheduled successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  });

  return router;
};
