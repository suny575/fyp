// import mongoose from "mongoose";

// const logsAdminSchema = new mongoose.Schema({
//   time: { type: Date, default: Date.now },
//   type: { type: String, required: true },      // e.g., "Security", "Manager", "System"
//   severity: { type: String, required: true },  // "Low", "Medium", "High"
//   description: { type: String, required: true },
//   user: { type: String, required: true },      // who performed the action
//   details: { type: String },
// });

// const LogsAdmin = mongoose.model("LogsAdmin", logsAdminSchema);
// export default LogsAdmin;

import mongoose from "mongoose";

const logsAdminSchema = new mongoose.Schema({
  event: { type: String, required: true },
  type: { type: String, required: true },      // Manager / Security / System
  severity: { type: String, required: true },  // Low / Medium / High
  description: { type: String },
  user: { type: String, default: "System" },   // Who performed the action
  createdAt: { type: Date, default: Date.now },
});

const LogsAdmin = mongoose.model("LogsAdmin", logsAdminSchema);
export default LogsAdmin;