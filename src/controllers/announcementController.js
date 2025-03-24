const Announcement = require("../models/Announcement");

// Create a New Announcement
const createAnnouncement = async (req, res) => {
  const { title, message, roles } = req.body;

  try {
    const announcement = await Announcement.create({ title, message, roles });

    res.status(201).json({ message: "Announcement created successfully", announcement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Announcements for a Specific Role
const getAnnouncementsByRole = async (req, res) => {
  const { role } = req.params; // Example: "Student", "Mentor", etc.

  try {
    const announcements = await Announcement.find({ roles: role });
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Announcements
const getAllAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createAnnouncement, getAnnouncementsByRole, getAllAnnouncements };
