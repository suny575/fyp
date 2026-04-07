import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user.js";

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.error("Usage: node tmp_reset_password.js <email> <newPassword>");
  process.exit(1);
}

const run = async () => {
  try {
    console.log("Connecting to Mongo...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected");

    const user = await User.findOne({ email });
    if (!user) {
      console.error("User not found:", email);
      process.exit(1);
    }

    // Set plain password; user pre-save hook will hash it
    user.password = newPassword;
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    console.log("Password reset for", email);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
