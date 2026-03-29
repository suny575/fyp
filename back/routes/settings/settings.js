import mongoose from "mongoose";

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

const Settings =
  mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

export default Settings;
