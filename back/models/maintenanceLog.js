import mongoose from "mongoose";

const maintenanceLogSchema = new mongoose.Schema(
  {
    workOrder: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WorkOrder",
      required: true,
    },

    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceSchedule",
      required: true,
    },

    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },

    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    maintenanceType: {
      type: String,
      enum: ["preventive", "inspection", "calibration"],
      required: true,
    },

    status: {
      type: String,
      enum: ["completed", "failed", "pending-review"],
      default: "pending-review",
    },

    completionDate: {
      type: Date,
      default: Date.now,
    },

    notes: {
      type: String,
      trim: true,
    },

    partsUsed: [
      {
        partName: String,
        quantity: Number,
      },
    ],

    supervisorApproved: {
      type: Boolean,
      default: false,
    },

    supervisorComments: {
      type: String,
    },
  },
  { timestamps: true },
);

const MaintenanceLog = mongoose.model("MaintenanceLog", maintenanceLogSchema);

export default MaintenanceLog;
