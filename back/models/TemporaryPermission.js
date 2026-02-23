const mongoose = require("mongoose");

const temporaryPermissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: String,
  expiresAt: Date,
});

module.exports = mongoose.model(
  "TemporaryPermission",
  temporaryPermissionSchema,
);
