import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: [
      "admin",
      "technician",
      "maintenanceManager",
      "depStaff",
      "pharmacyStore",
    ],
    required: true,
  },

   status: {
    type: String,
    enum: ["pending", "active", "inactive"],
    default: "pending",
  },
  
  approved: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },

  technicianProfile: {
    skills: [String],
    isActive: { type: Boolean, default: true },
    maxConcurrentTasks: { type: Number, default: 5 },
    totalAssignedTasks: { type: Number, default: 0 },
  },
});

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method (for login)
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// ✅ Compile model safely
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
