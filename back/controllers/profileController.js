import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import User from "../models/user.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const removeLocalImage = (imagePath) => {
  if (!imagePath || !imagePath.startsWith("/uploads/")) return;

  const localPath = path.join(projectRoot, imagePath.replace(/^\//, ""));
  if (fs.existsSync(localPath)) {
    fs.unlinkSync(localPath);
  }
};

const serializeUser = (user) => ({
  id: user._id.toString(),
  _id: user._id.toString(),
  name: user.name,
  email: user.email,
  role: user.role,
  profileImage: user.profileImage || "",
});

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const name = req.body.name?.trim();
    const email = req.body.email?.trim().toLowerCase();
    const password = req.body.password?.trim();

    if (name) {
      user.name = name;
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        email,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }

      user.email = email;
    }

    if (password) {
      user.password = password;
    }

    if (req.file) {
      removeLocalImage(user.profileImage);
      user.profileImage = `/${req.file.path.replace(/\\/g, "/")}`;
    }

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: serializeUser(user),
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Failed to update profile" });
  }
};
