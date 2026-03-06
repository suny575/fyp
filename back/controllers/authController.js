import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AdminNotification from "../models/AdminNotification.js";

// Register user
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({ message: "All fields required" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  //  // ⬅️ Add notification for successful registration
  // await AdminNotification.create({
  //   type: "System",
  //   message: `User ${user.name} (${user.role}) has registered with email ${user.email}`,
  //   time: new Date(),
  // });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.status(201).json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // ⬅️ Add notification if user not found (unauthorized)

  if (!user) 
     {
    await AdminNotification.create({
      type: "Critical",
      message: `Unauthorized login attempt for email ${email}`,
      // time: new Date(),
      time: new Date().toLocaleString(),
    });
    
    
    return res.status(401).json({ message: "Invalid credentials" });}

  const match = await bcrypt.compare(password, user.password);

  // ⬅️ Add notification if password wrong

  if (!match)
    {
    await AdminNotification.create({
      type: "Critical",
      message: `Unauthorized login attempt for email ${email}`,
      // time: new Date(),
      time: new Date().toLocaleString(),
    });

     return res.status(401).json({ message: "Invalid credentials" });}

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

// Get current logged-in user
export const getMe = async (req, res) => {
  res.json({
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  });
};
