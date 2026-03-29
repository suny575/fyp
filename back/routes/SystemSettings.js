import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema({
  qrScanEnabled: {
    type: Boolean,
    default: true,
  },
});

const SystemSettings =
  mongoose.models.SystemSettings ||
  mongoose.model("SystemSettings", settingsSchema);

export default SystemSettings;
