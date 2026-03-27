import mongoose from "mongoose";

const temporaryPermissionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  type: String,
  expiresAt: Date,
});

const TemporaryPermission =
  mongoose.models.TemporaryPermission ||
  mongoose.model("TemporaryPermission", temporaryPermissionSchema);

export default TemporaryPermission;
