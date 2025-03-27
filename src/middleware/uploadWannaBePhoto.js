const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Setup storage for WannaBe images
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = "uploads/wannabe";
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const uploadWannaBePhoto = multer({ storage, fileFilter });
module.exports = uploadWannaBePhoto;
