
import express from "express";
import User from "../models/user.js"; // ✅ updated to your new User model
import Invitation from "../models/invitation.js"; // ✅ for invited managers
import Notification from "../models/AdminNotification.js";
import Report from "../models/ReportsAdmin.js";
import LogsAdmin from "../models/LogsAdmin.js";
import { withHospitalScope, resolveHospitalName } from "../utils/hospitalScope.js";

const router = express.Router();

// GET ADMIN REPORTS
router.get("/reports", async (req, res) => {
  try {
    const hospital = req.user?.hospital;
    // ================= Managers =================
    // Registered managers (use actual status from the User record)
    const users = await User.find(
      withHospitalScope({ role: "maintenanceManager" }, hospital),
    ).select("name email role createdAt status");

    const userData = users.map((u) => ({
      name: u.name || "",
      email: u.email,
      // keep the stored status so active/inactive changes are reflected
      status: u.status || "active",
      date: u.createdAt?.toISOString().split("T")[0],
    }));

    // Pending invitations (only managers that have NOT registered yet)
    const invitations = await Invitation.find(
      withHospitalScope(
        { role: "maintenanceManager", used: false, status: "pending" },
        hospital,
      ),
    );

    const invitationData = invitations.map((i) => ({
      name: i.name || "", // optional name field on invitation
      email: i.email,
      status: "pending",
      date: i.createdAt?.toISOString().split("T")[0],
    }));

    const managersData = [...userData, ...invitationData]; // combine registered + pending invites

    // ================= Alerts =================
    const alerts = await Notification.find(withHospitalScope({}, hospital));

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
    const reports = await Report.find(
      withHospitalScope({}, hospital),
    ).sort({ createdAt: -1 });
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

// DASHBOARD STATS (Admin Overview)
router.get("/dashboard-stats", async (req, res) => {
  try {
    const hospital = req.user?.hospital;
    const managers = await User.find(
      withHospitalScope({ role: "maintenanceManager" }, hospital),
    );
    const totalManagers = managers.length;
    const activeManagers = managers.filter((m) => m.status === "active").length;
    const inactiveManagers = managers.filter((m) => m.status === "inactive").length;

    const criticalAlerts = await Notification.countDocuments(
      withHospitalScope({ type: "Critical" }, hospital),
    );
    const systemAlerts = await Notification.countDocuments(
      withHospitalScope({ type: "System" }, hospital),
    );

    const reportsGenerated = await Report.countDocuments(
      withHospitalScope({}, hospital),
    );

    // Total logs for activity count; also keep last 5 entries if needed later
    const totalLogs = await LogsAdmin.countDocuments(
      withHospitalScope({}, hospital),
    );

    const recentActivity = await LogsAdmin.find(
      withHospitalScope({}, hospital),
    )
      .sort({ createdAt: -1 })
      .limit(5)
      .select("event description user createdAt type severity");

    res.json({
      managers: {
        total: totalManagers,
        active: activeManagers,
        inactive: inactiveManagers,
      },
      alerts: {
        critical: criticalAlerts,
        system: systemAlerts,
      },
      reportsGenerated,
      recentActivity,
      totalLogs,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server Error" });
  }
});

// Save report
router.post("/save-report", async (req, res) => {
  try {
    const { name } = req.body;
    const hospital = resolveHospitalName(req.user?.hospital);

    const report = await Report.create({
      name,
      type: "PDF",
      generatedBy: "Admin",
      hospital,
    });

    res.status(201).json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error saving report" });
  }
});

export default router;
