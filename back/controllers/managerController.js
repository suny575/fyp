// dashboardController.mjs (or .js if type: "module" in package.json)
import User from "../models/User.js";
import EquipmentAssignment from "../models/equipment.js";
import StockRequest from "../models/StockRequest.js";
import Fault from "../models/fault.js";

const getDashboardSummary = async (req, res) => {
  try {
    // ===== USER COUNTS =====
    const technicians = await User.countDocuments({ role: "technician" });
    const depStaff = await User.countDocuments({ role: "depstaff" });
    const pharmacy = await User.countDocuments({ role: "pharmacystore" });

    // ===== EQUIPMENT COUNTS =====
    const totalEquipment = await EquipmentAssignment.countDocuments();
    const assignedEquipment = await EquipmentAssignment.countDocuments({
      assignedTo: { $exists: true, $ne: null },
    });
    const availableEquipment = totalEquipment - assignedEquipment;

    // ===== SYSTEM STATS =====
    const pendingTasks = await Fault.countDocuments({
      status: { $in: ["pending", "assigned"] },
    });

    const completedTasks = await Fault.countDocuments({
      status: "resolved",
    });

    const activeFaults = await Fault.countDocuments({
      status: { $in: ["pending", "assigned"] },
    });

    const activeReports = await StockRequest.countDocuments({
      status: "pending",
    });

    // ===== RECENT ACTIVITY (last 5 faults) =====
    const recentFaults = await Fault.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("reportedBy", "name");

    const recentActivity = recentFaults.map((fault) => {
      return `${fault.reportedBy?.name || "User"} reported: ${fault.description}`;
    });

    res.json({
      users: {
        technicians,
        depStaff,
        pharmacy,
      },
      equipment: {
        totalEquipment,
        assignedEquipment,
        availableEquipment,
      },
      stats: {
        pendingTasks,
        completedTasks,
        activeFaults,
        activeReports,
      },
      recentActivity,
    });
  } catch (error) {
    console.error("Dashboard Summary Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export default getDashboardSummary;
