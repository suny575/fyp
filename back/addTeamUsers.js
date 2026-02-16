const mongoose = require("mongoose");
require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/user");

connectDB().then(async () => {
  try {
    const teamUsers = [
      {
        name: "Suny",
        email: "suny@example.com",
        password: "yourSecurePassword",
        role: "admin",
        department: "IT",
      },
      {
        name: "Buom",
        email: "buom@example.com",
        password: "yourSecurePassword",
        role: "technician",
        department: "Maintenance",
      },
      {
        name: "Sena",
        email: "sena@example.com",
        password: "yourSecurePassword",
        role: "maintenanceManager",
        department: "Maintenance",
      },
      {
        name: "Natoli",
        email: "natoli@example.com",
        password: "yourSecurePassword",
        role: "depStaff",
        department: "Radiology",
      },
      {
        name: "Demile",
        email: "demile@example.com",
        password: "yourSecurePassword",
        role: "pharmacyStore",
        department: "Pharmacy",
      },
    ];

    await User.insertMany(teamUsers);
    console.log("✅ Team users added successfully!");

    process.exit();
  } catch (error) {
    console.error("❌ Error adding team users:", error.message);
    process.exit(1);
  }
});
