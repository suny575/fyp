// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { ensureUserHospital } from "../utils/hospitalScope.js";

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Ensure header exists and follows correct format
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, not authorized" });
    }

    const token = authHeader.split(" ")[1];

    // Ensure token actually exists
    if (!token) {
      return res.status(401).json({ message: "No token, not authorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    await ensureUserHospital(req.user);

    next();

  } catch (err) {
    console.error("AuthMiddleware error:", err.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protect;