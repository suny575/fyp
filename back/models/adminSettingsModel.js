import mongoose from "mongoose";

const adminSettingsSchema = new mongoose.Schema({
  enableCriticalAlerts: { type: Boolean, default: true },
  autoRestart: { type: Boolean, default: false },

  maxLoginAttempts: { type: Number, default: 5 },
  minPasswordLength: { type: Number, default: 8 },
  requireStrongPassword: { type: Boolean, default: true },
  sessionTimeout: { type: Number, default: 30 },

  emailNotifications: { type: Boolean, default: true },
  inAppNotifications: { type: Boolean, default: true },
  soundAlert: { type: Boolean, default: false }

}, { timestamps: true });

const AdminSettings = mongoose.model("AdminSettings", adminSettingsSchema);

export default AdminSettings;