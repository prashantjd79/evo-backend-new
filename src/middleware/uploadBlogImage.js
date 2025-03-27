const multer = require("multer");
const path = require("path");
const fs = require("fs");

const folder = "uploads/blogs";
fs.mkdirSync(folder, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, folder),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e6);
    cb(null, unique + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

module.exports = multer({ storage, fileFilter });
