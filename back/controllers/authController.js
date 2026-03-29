import User from "../models/user.js";
import Invitation from "../models/invitation.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AdminNotification from "../models/AdminNotification.js";
import { sendNotification } from "../services/notification.service.js"; // ✅ correct import
import { getAdminSettings } from "../services/adminSettingsService.js";

const createCriticalAlert = async (title, message) => {
  const settings = await getAdminSettings();
  if (settings?.enableCriticalAlerts === false) return;

  await AdminNotification.create({
    type: "Critical",
    message: `${title}: ${message}`,
    time: new Date().toLocaleString(),
  });
};
import {
  ensureUserHospital,
  resolveHospitalName,
} from "../utils/hospitalScope.js";

const serializeUser = (user) => ({
  id: user._id.toString(),
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  hospital: resolveHospitalName(user.hospital),
  profileImage: user.profileImage || "",
});

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      hospital: resolveHospitalName(user.hospital),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    email = email?.trim();
    password = password?.trim();

    if (!email || !password) {
      console.warn("Login failed: Missing email or password", req.body);
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      console.warn("Login failed: User not found", email);
      await createCriticalAlert(
        "Unauthorized login attempt",
        `Unknown email ${email} tried to login`
      );
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const settings = await getAdminSettings();
    const maxAttempts = settings?.maxLoginAttempts ?? 5;

    // Account lock check
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const minutes = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
      return res
        .status(423)
        .json({ message: `Account locked. Try again in ~${minutes} minute(s).` });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Entered password:", password);
    console.log("Stored hash:", user.password);
    console.log("Match result:", isMatch);

    if (!isMatch) {
      console.warn(`Login failed: Incorrect password for email ${email}`);

      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;

      if (user.failedLoginAttempts >= maxAttempts) {
        // lock for 15 minutes
        user.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
        await createCriticalAlert(
          "Multiple failed login attempts",
          `Account ${email} locked after ${maxAttempts} failed attempts`
        );
      }
      await user.save();

      const remaining =
        user.lockUntil && user.lockUntil > Date.now()
          ? 0
          : Math.max(maxAttempts - user.failedLoginAttempts, 0);

      return res.status(401).json({
        message:
          remaining > 0
            ? `Invalid credentials. Attempts left: ${remaining}`
            : "Account locked due to repeated failures. Try again later.",
      });
    }

    // Successful login -> reset counters
    user.failedLoginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    await ensureUserHospital(user);
    const token = generateToken(user);

    console.log(`Login successful for user: ${email}`);

    res.status(200).json({
      message: "Login successful",
      token,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { name, password, token } = req.body;

    if (!name || !password || !token) {
      return res.status(400).json({
        message: "Name, password and invitation token are required",
      });
    }

    const invitation = await Invitation.findOne({
      token,
      used: false,
      expiresAt: { $gt: new Date() },
    });

    if (!invitation) {
      return res.status(400).json({
        message: "Invalid or expired invitation",
      });
    }

    const existingUser = await User.findOne({ email: invitation.email });
    if (existingUser) {
      return res.status(409).json({
        message: "User already registered",
      });

    const settings = await getAdminSettings();
    const minLength = settings?.minPasswordLength ?? 8;
    const requireStrong = settings?.requireStrongPassword ?? true;

    if ((password || "").length < minLength) {
      return res
        .status(400)
        .json({ message: `Password must be at least ${minLength} characters.` });
    }

    if (requireStrong) {
      const strongRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).+$/;
      if (!strongRegex.test(password)) {
        return res.status(400).json({
          message:
            "Password must include upper, lower, number, and special character.",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    }

    const user = await User.create({
      name,
      email: invitation.email,
      role: invitation.role,
      password: hashedPassword,
      hospital: resolveHospitalName(invitation.hospital),
      password,
      status: "active",
    });

    invitation.used = true;
    await invitation.save();

    const jwtToken = generateToken(user);

    res.status(201).json({
      message: "Registration successful",
      token: jwtToken,
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    await ensureUserHospital(req.user);
    res.status(200).json(serializeUser(req.user));
  } catch (error) {
    res.status(500).json({ message: "Server error fetching user" });
  }
};
