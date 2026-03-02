import mongoose from "mongoose";

const maintenanceLogSchema = new mongoose.Schema(
  {
    equipmentRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },

    taskRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceTask",
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    description: {
      type: String,
      required: true,
    },

    cost: {
      type: Number,
      default: 0,
    },

    durationHours: {
      type: Number,
    },
  },
  { timestamps: true },
);

const MaintenanceLog =
  mongoose.models.MaintenanceLog ||
  mongoose.model("MaintenanceLog", maintenanceLogSchema);

export default MaintenanceLog;
