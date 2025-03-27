const multer = require("multer");
const path = require("path");
const fs = require("fs");

const folder = "uploads/course-creators";
fs.mkdirSync(folder, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only image files are allowed"));
};

const uploadCourseCreatorPhoto = multer({ storage, fileFilter });

module.exports = uploadCourseCreatorPhoto;
