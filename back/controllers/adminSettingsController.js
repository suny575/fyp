import AdminSettings from "../models/adminSettingsModel.js";
import { createLog } from "./logControllerAdmin.js";

// GET SETTINGS
export const getAdminSettings = async (req, res) => {
  try {

    let settings = await AdminSettings.findOne();

    if (!settings) {
      settings = await AdminSettings.create({});
    }

    res.json(settings);

  } catch (error) {
    res.status(500).json({ message: "Error fetching admin settings" });
  }
};


// UPDATE SETTINGS
export const updateAdminSettings = async (req, res) => {
  try {

    let settings = await AdminSettings.findOne();

    if (!settings) {
      settings = new AdminSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    await settings.save();

      // 🔹 CREATE SYSTEM LOG
    await createLog({
      event: "Admin settings updated",
      type: "System",
      severity: "Medium",
      description: "Administrator updated system settings",
      user: "Admin"
    });

    res.json({
      message: "Admin settings updated successfully",
      settings
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating admin settings" });
  }
};