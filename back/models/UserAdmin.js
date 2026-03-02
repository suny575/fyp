

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userAdminSchema = new mongoose.Schema(
  {
    name: { type: String, default: null }, // manager fills on registration
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, default: null },
    role: { type: String, enum: ["admin", "manager"], required: true },
    status: { type: String, enum: ["pending", "active", "inactive"], default: "pending" },
    invitationToken: { type: String, default: null },
    invitationExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

// Hash password when set
userAdminSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userAdminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const UserAdmin = mongoose.models.UserAdmin || mongoose.model("UserAdmin", userAdminSchema);
export default UserAdmin;