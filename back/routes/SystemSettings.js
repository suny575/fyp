const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  qrScanEnabled: {
    type: Boolean,
    default: true,
  },
});

module.exports = mongoose.model("SystemSettings", settingsSchema);
