// config/db.js
import mongoose from "mongoose";

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("[MongoDB] MONGO_URI missing in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI); // <- no extra options
    console.log("[MongoDB] Connected");
    console.log("[MongoDB] Connection established and ready for queries.");
  } catch (error) {
    console.error("[MongoDB] Database connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
