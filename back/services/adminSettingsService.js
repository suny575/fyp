import AdminSettings from "../models/adminSettingsModel.js";

// Simple in-memory cache to reduce queries on hot paths (login/notifications)
let cachedSettings = null;
let lastFetch = 0;
const CACHE_TTL_MS = 60 * 1000; // 1 minute

export const getAdminSettings = async () => {
  const now = Date.now();
  if (cachedSettings && now - lastFetch < CACHE_TTL_MS) {
    return cachedSettings;
  }

  let settings = await AdminSettings.findOne();
  if (!settings) {
    settings = await AdminSettings.create({});
  }

  cachedSettings = settings;
  lastFetch = now;
  return settings;
};

export const clearSettingsCache = () => {
  cachedSettings = null;
  lastFetch = 0;
};

export default getAdminSettings;
