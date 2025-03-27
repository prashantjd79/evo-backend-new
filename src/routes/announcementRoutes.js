const express = require("express");
const { createAnnouncement, getAnnouncementsByRole, getAllAnnouncements } = require("../controllers/announcementController");
const { adminProtect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadAnnouncementPhoto");

const router = express.Router();

router.post("/",adminProtect, upload.single("image"), createAnnouncement);

//router.get("/:role", adminProtect, getAnnouncementsByRole); // Get announcements for a specific role
router.get("/",  getAllAnnouncements); // Get all announcements

module.exports = router;
