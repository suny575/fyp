import mongoose from "mongoose";

const invitationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  status: { type: String, default: "pending" }, // pending | accepted
  token: {
    type: String,
    required: true,
    unique: true,
  },
  expiresAt: {
    type: Date,
    default: () => Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Invitation", invitationSchema);
