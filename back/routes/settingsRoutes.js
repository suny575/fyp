const express = require("express");
const router = express.Router();
const SystemSettings = require("../models/SystemSettings");

router.patch("/qrscan", async (req, res) => {
  const { enabled } = req.body;

  let settings = await SystemSettings.findOne();

  if (!settings) {
    settings = await SystemSettings.create({});
  }

  settings.qrScanEnabled = enabled;
  await settings.save();

  res.json({ message: "QR Scan setting updated" });
});

router.get("/qrscan", async (req, res) => {
  const settings = await SystemSettings.findOne();
  res.json({ enabled: settings?.qrScanEnabled ?? true });
});

module.exports = router;
