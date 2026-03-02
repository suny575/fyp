import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true },
  status: { type: String, default: "pending" },
  used: { type: Boolean, default: false },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, default: () => Date.now() + 48 * 60 * 60 * 1000 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Invitation ||
  mongoose.model("Invitation", invitationSchema);
