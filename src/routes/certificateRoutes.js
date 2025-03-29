// routes/certificateRoutes.js
const router = require("express").Router();
const { issueCertificate } = require("../controllers/certificateController");
const { uploadCertificate } = require("../middleware/certificate");
const { adminProtect } = require("../middleware/authMiddleware");

// Issue Certificate (Admin only)
router.post(
  "/issue",
  adminProtect,
  uploadCertificate.single("certificate"),
  issueCertificate
);

module.exports = router;
