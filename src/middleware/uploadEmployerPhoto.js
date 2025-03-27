const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = "uploads/employers";
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

// File filter (only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    console.log("📥 File received once:", file.originalname);
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const uploadEmployerPhoto = multer({ storage, fileFilter });
module.exports = uploadEmployerPhoto;
