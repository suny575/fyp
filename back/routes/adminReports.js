
import express from "express";
import User from "../models/user.js"; // ✅ updated to your new User model
import Invitation from "../models/invitation.js"; // ✅ for invited managers
import Notification from "../models/AdminNotification.js";
import Report from "../models/ReportsAdmin.js";

const router = express.Router();

// GET ADMIN REPORTS
router.get("/reports", async (req, res) => {
  try {
    // ================= Managers =================
    // Active registered managers
    const users = await User.find({ role: "maintenanceManager" })
      .select("name email role createdAt");

    const userData = users.map((u) => ({
      name: u.name || "",
      email: u.email,
      status: "Active",
      date: u.createdAt?.toISOString().split("T")[0],
    }));

    // Pending invited managers
    const invitations = await Invitation.find({ role: "maintenanceManager" });
    const invitationData = invitations.map((i) => ({
      name: i.name || "", // you can optionally store name on invitation later
      email: i.email,
      status: i.status?.charAt(0).toUpperCase() + i.status.slice(1) || "Pending",
      date: i.createdAt?.toISOString().split("T")[0],
    }));

    const managersData = [...userData, ...invitationData]; // combine registered + invited

    // ================= Alerts =================
    const alerts = await Notification.find();

    const criticalAlerts = alerts.filter((a) => a.type === "Critical");
    const systemAlerts = alerts.filter((a) => a.type === "System");

    const alertsSummary = [
      {
        type: "Critical",
        total: criticalAlerts.length,
        resolved: criticalAlerts.filter((a) => a.resolved).length,
        unresolved: criticalAlerts.filter((a) => !a.resolved).length,
        date: new Date().toISOString().split("T")[0],
      },
      {
        type: "System",
        total: systemAlerts.length,
        resolved: systemAlerts.filter((a) => a.resolved).length,
        unresolved: systemAlerts.filter((a) => !a.resolved).length,
        date: new Date().toISOString().split("T")[0],
      },
    ];

    // ================= Reports =================
    const reports = await Report.find().sort({ createdAt: -1 });
    const reportsHistory = reports.map((r) => ({
      name: r.name,
      type: r.type,
      generatedBy: r.generatedBy,
      date: r.createdAt.toISOString().split("T")[0],
    }));

    res.json({
      managers: managersData,
      alerts: alertsSummary,
      reports: reportsHistory,
    });
  } catch (error) {
    console.error("Reports Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Save report
router.post("/save-report", async (req, res) => {
  try {
    const { name } = req.body;

    const report = await Report.create({
      name,
      type: "PDF",
      generatedBy: "Admin",
    });

    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving report" });
  }
});

export default router;