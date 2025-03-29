// middlewares/multer.js
const multer = require("multer");
const path = require("path");

const certificateStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/certificates");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadCertificate = multer({
  storage: certificateStorage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDFs are allowed"), false);
    }
  },
});

module.exports = {
  uploadCertificate,
};
