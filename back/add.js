// createAdmin.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  hospital: String,
  role: String,
  status: String,
  failedLoginAttempts: Number,
  approved: Boolean,
  profileImage: String,
  createdAt: Date,
});

const User = mongoose.model("User", userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected");

    const email = "sunyfkr@gmail.com"; // change this
    const existing = await User.findOne({ email });

    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash("StrongPassword", 10);

    const admin = new User({
      name: "System Admin",
      email: email,
      password: hashedPassword,
      hospital: "Main Hospital",
      role: "admin",
      status: "active",
      approved: true,
      failedLoginAttempts: 0,
      profileImage: "",
      createdAt: new Date(),
    });

    await admin.save();

    console.log("✅ Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", "Admin@123");

    process.exit();
  } catch (err) {
    console.error("❌ Error creating admin:", err);
    process.exit(1);
  }
}

createAdmin();