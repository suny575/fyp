// models/equipment.js
import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    model: { type: String, required: true },
    serial: { type: String, required: true, unique: true },
    purchaseDate: { type: Date, required: true },
    department: { type: String, required: true },
    supportEmail: { type: String, trim: true, lowercase: true, default: "" },
    supportWebsite: { type: String, trim: true, default: "" },
    hospital: {
      type: String,
      trim: true,
      index: true,
    },
    allocatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    allocationDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["active", "under_maintenance"],
      default: "active",
    },
  },
  { timestamps: true },
);

// const Equipment = mongoose.model("Equipment", equipmentSchema);

export default mongoose.models.Equipment ||
  mongoose.model("Equipment", equipmentSchema);
