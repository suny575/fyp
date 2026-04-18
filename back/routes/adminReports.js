
import express from "express";
import User from "../models/user.js"; // ✅ updated to your new User model
import Invitation from "../models/invitation.js"; // ✅ for invited managers
import Notification from "../models/AdminNotification.js";
import Report from "../models/ReportsAdmin.js";
import LogsAdmin from "../models/LogsAdmin.js";
import { withHospitalScope, resolveHospitalName } from "../utils/hospitalScope.js";

const router = express.Router();

// Mounted at /api/admin/reporting

const normalizeAlertType = (value) =>
  (value || "").toString().trim().toLowerCase();

const getManagerData = async () => {
  const invitations = await Invitation.find({
    role: "maintenanceManager",
  }).lean();

  const users = await User.find({ role: "maintenanceManager" })
    .select("name email role createdAt status hospital")
    .lean();

  const pendingInvitations = invitations.filter(
    (invitation) => invitation.used === false && invitation.status === "pending",
  );

  return { users, pendingInvitations };
};

// GET ADMIN REPORTS
router.get("/", async (req, res) => {
  try {
    const hospital = req.user?.hospital;
    const { users, pendingInvitations } = await getManagerData();

    // ================= Managers =================
    const userData = users.map((u) => ({
      name: u.name || "",
      email: u.email,
      // keep the stored status so active/inactive changes are reflected
      status: u.status || "active",
      date: u.createdAt?.toISOString().split("T")[0],
    }));

    const invitationData = pendingInvitations.map((i) => ({
      name: i.name || "", // optional name field on invitation
      email: i.email,
      status: "pending",
      date: i.createdAt?.toISOString().split("T")[0],
    }));

    const managersData = [...userData, ...invitationData]; // combine registered + pending invites

    // ================= Alerts =================
    const criticalAlerts = await Notification.find(
      withHospitalScope({ type: { $regex: /^critical$/i } }, hospital),
    ).lean();
    // System alert cards are intended to reflect platform-wide system events.
    const systemAlerts = await Notification.find({
      type: { $regex: /^system$/i },
    }).lean();

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
    const { users, pendingInvitations } = await getManagerData();
    const totalManagers = users.length + pendingInvitations.length;
    const activeManagers = users.filter((m) => m.status === "active").length;
    const inactiveManagers = users.filter((m) => m.status === "inactive").length;

    const criticalAlerts = await Notification.countDocuments(
      withHospitalScope({ type: { $regex: /^critical$/i } }, hospital),
    );
    const systemAlerts = await Notification.countDocuments(
      { type: { $regex: /^system$/i } },
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
