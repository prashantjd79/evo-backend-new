const Announcement = require("../models/Announcement");

const createAnnouncement = async (req, res) => {
  try {
    const { title, description, roles } = req.body;

    // Parse roles if sent as a stringified array
    const parsedRoles = typeof roles === "string" ? JSON.parse(roles) : roles;

    const image = req.file ? req.file.path : null;

    const announcement = await Announcement.create({
      title,
      description,
      roles: parsedRoles,
      image,
    });

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
