const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Detect folder from route or fallback to "general"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Detect upload type from req.uploadType set manually in route
    const type = req.uploadType || "general";
    const folder = path.join("uploads", type);

    fs.mkdirSync(folder, { recursive: true });
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;
