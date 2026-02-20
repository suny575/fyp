// models/Settings.js
const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  maintenanceInterval: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    default: "weekly",
  },
  autoAssignment: {
    type: Boolean,
    default: true,
  },
  emailAlerts: {
    type: Boolean,
    default: true,
  },
  defaultReportView: {
    type: String,
    enum: ["daily", "weekly", "monthly"],
    default: "monthly",
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false,
  },
  trackedEvents: {
    taskUpdates: { type: Boolean, default: true },
    userActions: { type: Boolean, default: true },
  },
});

module.exports = mongoose.model("Settings", settingsSchema);
