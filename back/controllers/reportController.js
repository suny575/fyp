// controllers/reportController.js
const Task = require("../models/Task");

exports.getFullReport = async (req, res) => {
  try {
    const { startDate, endDate, role } = req.query;

    const matchStage = {};

    if (startDate && endDate) {
      matchStage.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (role && role !== "all") {
      matchStage.role = role;
    }

    // 1️⃣ KPI Overview
    const kpi = await Task.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalTasks: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          avgProcessingTime: { $avg: "$processingTime" },
        },
      },
    ]);

    // 2️⃣ Role Breakdown
    const roleBreakdown = await Task.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$role",
          total: { $sum: 1 },
          avgTime: { $avg: "$processingTime" },
        },
      },
    ]);

    // 3️⃣ Trend Over Time
    const trend = await Task.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          total: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      kpi: kpi[0] || {},
      roleBreakdown,
      trend,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to generate full report" });
  }
};
