import mongoose from "mongoose";

const stockRequestSchema = new mongoose.Schema(
  {
    item: { type: String, required: true },
    quantity: { type: Number, required: true },
    hospital: { type: String, trim: true, index: true },
    department: { type: String, required: true },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reason: { type: String },
    allocationDate: { type: Date },
  },
  { timestamps: true },
);

export default mongoose.model("StockRequest", stockRequestSchema);
