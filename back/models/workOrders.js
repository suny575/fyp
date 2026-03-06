import mongoose from "mongoose";

const WorkOrderSchema = new mongoose.Schema(
  {
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceSchedule",
    },

    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
    },

    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    scheduledDate: Date,

    status: {
      type: String,
      enum: ["pending", "assigned", "in_progress", "completed"],
      default: "pending",
    },
  },
  { timestamps: true },
);
const workorder = mongoose.model("WorkOrder", WorkOrderSchema);
export default workorder;
