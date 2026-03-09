import mongoose from "mongoose";

const maintenanceScheduleSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },

    frequency: {
      type: String,
      enum: ["weekly", "monthly", "yearly", "custom"],
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },

    customIntervalDays: {
      type: Number,
      default: null,
    },

    nextMaintenanceDate: {
      type: Date,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

const maintenanceSchedule = mongoose.model(
  "MaintenanceSchedule",
  maintenanceScheduleSchema,
);

export default maintenanceSchedule;
