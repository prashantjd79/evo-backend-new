const express = require("express");
const { createAnnouncement, getAnnouncementsByRole, getAllAnnouncements } = require("../controllers/announcementController");
const { adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", adminProtect, createAnnouncement); // Admin creates an announcement
//router.get("/:role", adminProtect, getAnnouncementsByRole); // Get announcements for a specific role
router.get("/",  getAllAnnouncements); // Get all announcements

module.exports = router;
