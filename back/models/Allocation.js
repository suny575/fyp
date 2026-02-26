

// import mongoose from "mongoose";

// const allocationSchema = new mongoose.Schema(
//   {
//     type: { type: String, enum: ["Stock", "Equipment"], required: true },
//     name: { type: String, required: true }, // Stock item name or equipment
//     department: { type: String, required: true },
//     quantity: { type: Number, required: true },
//     allocatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//     date: { type: Date, default: Date.now },
//     stockItem: { type: mongoose.Schema.Types.ObjectId, ref: "Stock" }, // link to Stock if type=Stock
//     equipment: { type: mongoose.Schema.Types.ObjectId, ref: "Equipment" }, // link to Equipment if type=Equipment
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Allocation", allocationSchema);

