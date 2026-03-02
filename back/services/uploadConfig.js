// backend/services/uploadConfig.js
import multer from "multer";
import path from "path";
import fs from "fs";

// Make sure upload folders exist
const ensureFolder = (folder) => {
  if (!fs.existsSync(folder)) fs.mkdirSync(folder, { recursive: true });
};
ensureFolder("uploads/images");
ensureFolder("uploads/audio");

// Storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === "images") cb(null, "uploads/images");
    else if (file.fieldname === "voiceNote") cb(null, "uploads/audio");
    else cb(null, "uploads"); // fallback
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + "-" + file.fieldname + ext);
  },
});

// Filter files
const fileFilter = (req, file, cb) => {
  if (file.fieldname === "images") {
    if (!file.mimetype.startsWith("image/"))
      return cb(new Error("Only images allowed"), false);
  } else if (file.fieldname === "voiceNote") {
    if (!file.mimetype.startsWith("audio/"))
      return cb(new Error("Only audio allowed"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

export default upload;
