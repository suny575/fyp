import mongoose from "mongoose";

const WorkOrderSchema = new mongoose.Schema(
  {
    schedule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MaintenanceSchedule",
      required: true,
    },

    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
    },
    hospital: {
      type: String,
      trim: true,
      index: true,
    },

    technician: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    scheduledDate: Date,

    status: {
      type: String,
      enum: [
        "SCHEDULED",
        "IN_PROGRESS",
        "COMPLETED_OK",
        "COMPLETED_WITH_ISSUES",
        "NEEDS_REPAIR",
        "pending",
        "assigned",
        "in_progress",
        "inProgress",
        "completed",
      ],
      default: "SCHEDULED",
    },
  },
  { timestamps: true },
);
const workorder = mongoose.model("WorkOrder", WorkOrderSchema);
export default workorder;
