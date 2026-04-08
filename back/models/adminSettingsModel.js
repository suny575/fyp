import mongoose from "mongoose";

const adminSettingsSchema = new mongoose.Schema({
  autoRestart: { type: Boolean, default: false },

  maxLoginAttempts: { type: Number, default: 5 },
  minPasswordLength: { type: Number, default: 8 },
  requireStrongPassword: { type: Boolean, default: true },

  inAppNotifications: { type: Boolean, default: true },
  soundAlert: { type: Boolean, default: false }

}, { timestamps: true });

const AdminSettings = mongoose.model("AdminSettings", adminSettingsSchema);

export default AdminSettings;
