// import LogsAdmin from "../models/LogsAdmin.js";

// // GET all system logs
// export const getSystemLogs = async (req, res) => {
//   try {
//     const logs = await LogsAdmin.find().sort({ time: -1 }); // newest first
//     res.json(logs);
//   } catch (error) {
//     console.error("System Logs Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // POST a new log (e.g., when Admin invites manager)
// export const createSystemLog = async (req, res) => {
//   try {
//     const { type, severity, description, user, details } = req.body;

//     const newLog = new LogsAdmin({
//       type,
//       severity,
//       description,
//       user,
//       details,
//     });

//     await newLog.save();
//     res.status(201).json(newLog);
//   } catch (error) {
//     console.error("Create Log Error:", error);
//     res.status(500).json({ message: error.message });
//   }
// };


import LogsAdmin from "../models/LogsAdmin.js";

// Create a log
export const createLog = async ({ event, type, severity, description, user }) => {
  try {
    const log = new LogsAdmin({ event, type, severity, description, user });
    await log.save();
    return log;
  } catch (err) {
    console.error("Error creating log:", err);
    throw err;
  }
};

// Get all logs with optional filters for frontend
export const getLogs = async (req, res) => {
  try {
    const logs = await LogsAdmin.find().sort({ createdAt: -1 });

    // Extract unique types & severities for dropdowns
    const types = [...new Set(logs.map((l) => l.type))];
    const severities = [...new Set(logs.map((l) => l.severity))];

    res.json({ logs, types, severities });
  } catch (err) {
    console.error("Error fetching logs:", err);
    res.status(500).json({ message: "Server error" });
  }
};