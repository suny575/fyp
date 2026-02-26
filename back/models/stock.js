import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    batch: { type: String, required: true },
    category: { type: String, required: true },
    quantity: { type: Number, required: true },
    expiry: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("stock", stockSchema);