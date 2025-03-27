const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = path.join("uploads", "category");
    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname)); // .png / .jpg / .webp
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error("Only image files are allowed"));
};

const uploadCategoryIcon = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = uploadCategoryIcon;
