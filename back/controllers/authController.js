import User from "../models/user.js";
import Invitation from "../models/invitation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Generate JWT
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// ================= LOGIN =================
// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    // Trim inputs to remove extra spaces
    email = email?.trim();
    password = password?.trim();

    if (!email || !password) {
      console.warn("Login failed: Missing email or password", req.body);
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.warn("Login failed: User not found", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.warn(
        `Login failed: Incorrect password for email ${email}`,
        "Attempted:",
        password,
        "Stored hash:",
        user.password,
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user);

    console.log(`Login successful for user: ${email}`);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

// ================= REGISTER (INVITATION BASED) =================
export const registerUser = async (req, res) => {
  try {
    const { name, password, token } = req.body;

    if (!name || !password || !token)
      return res.status(400).json({
        message: "Name, password and invitation token are required",
      });

    const invitation = await Invitation.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!invitation)
      return res.status(400).json({
        message: "Invalid or expired invitation",
      });

    const existingUser = await User.findOne({ email: invitation.email });
    if (existingUser)
      return res.status(409).json({
        message: "User already registered",
      });

    // const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: invitation.email,
      role: invitation.role,
      password: password,
      status: "active",
    });

    invitation.used = true;
    await invitation.save();

    const jwtToken = generateToken(user);

    res.status(201).json({
      message: "Registration successful",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

//get me
export const getMe = async (req, res) => {
  try {
    res.status(200).json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error fetching user" });
  }
};
