import mongoose from "mongoose";

const equipmentReportSchema = new mongoose.Schema(
  {
    equipment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Equipment",
      required: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending", // waiting for manager approval
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    createdAt: { type: Date, default: Date.now },
    approvedAt: { type: Date },
  },
  { timestamps: true },
);

const EquipmentReport =
  mongoose.models.EquipmentReport ||
  mongoose.model("EquipmentReport", equipmentReportSchema);

export default EquipmentReport;
