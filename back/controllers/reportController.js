import Task from "../models/Task.js";

export const getFullReport = async (req, res) => {
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
