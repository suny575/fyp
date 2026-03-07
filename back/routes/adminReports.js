import express from "express";
import User from "../models/UserAdmin.js";
import Notification from "../models/AdminNotification.js";
import Report from "../models/ReportsAdmin.js";

const router = express.Router();

// GET ADMIN REPORTS
router.get("/reports", async (req, res) => {
  try {

    // Managers + invited managers
    const managers = await User.find({ role: "manager" })
      .select("name email status createdAt");

    // const managerData = managers.map((m) => ({
    //   name: m.name || "",
    //   email: m.email,
    //   status: m.status || "Pending",
    //   date: m.createdAt?.toISOString().split("T")[0]
    // }));

    const managerData = managers.map((m) => ({
  name: m.name || "",
  email: m.email,
  status: m.status ? m.status.charAt(0).toUpperCase() + m.status.slice(1) : "Pending",
  date: m.createdAt?.toISOString().split("T")[0]
}));


    // Alerts Summary
    const alerts = await Notification.find();

    const criticalAlerts = alerts.filter(a => a.type === "Critical");
    const systemAlerts = alerts.filter(a => a.type === "System");

    const alertsSummary = [
      {
        type: "Critical",
        total: criticalAlerts.length,
        resolved: criticalAlerts.filter(a => a.resolved).length,
        unresolved: criticalAlerts.filter(a => !a.resolved).length,
        date: new Date().toISOString().split("T")[0]
      },
      {
        type: "System",
        total: systemAlerts.length,
        resolved: systemAlerts.filter(a => a.resolved).length,
        unresolved: systemAlerts.filter(a => !a.resolved).length,
        date: new Date().toISOString().split("T")[0]
      }
    ];

   router.post("/save-report", async (req, res) => {
  try {

    const { name } = req.body;

    const report = await Report.create({
      name,
      type: "PDF",
      generatedBy: "Admin"
    });

    res.status(201).json(report);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving report" });
  }
});



    // // Reports History (mock for now)
    // const reportsHistory = [
    //   {
    //     name: "Monthly Summary",
    //     type: "PDF",
    //     date: "2026-02-01",
    //     generatedBy: "Admin"
    //   },
    //   {
    //     name: "Manager Report",
    //     type: "CSV",
    //     date: "2026-01-25",
    //     generatedBy: "Admin"
    //   }
    // ];

    const reports = await Report.find().sort({ createdAt: -1 });

const reportsHistory = reports.map((r) => ({
  name: r.name,
  type: r.type,
  generatedBy: r.generatedBy,
  date: r.createdAt.toISOString().split("T")[0]
}));

    res.json({
      managers: managerData,
      alerts: alertsSummary,
      // reports: reportsHistory
    });

  } catch (error) {
    console.error("Reports Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;