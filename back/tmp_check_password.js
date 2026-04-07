import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/user.js";

const email = process.argv[2];
const testPassword = process.argv[3];

if (!email || !testPassword) {
  console.error("Usage: node tmp_check_password.js <email> <password>");
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

    const ok = await bcrypt.compare(testPassword, user.password);
    console.log("Hash:", user.password);
    console.log("Password matches?:", ok);
    console.log("Failed attempts:", user.failedLoginAttempts, "Lock until:", user.lockUntil);
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

run();
