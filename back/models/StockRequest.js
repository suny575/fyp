

import mongoose from "mongoose";

const stockRequestSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    department: { type: String, required: true },       // 👈 department
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // 👈 who requested
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
    reason: { type: String },                           // optional if you keep reason
    allocationDate: { type: Date },                    // optional for when approved
  },
  { timestamps: true } // adds createdAt & updatedAt automatically
);

export default mongoose.model("StockRequest", stockRequestSchema);