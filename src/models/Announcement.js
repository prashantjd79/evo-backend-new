const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  message: { type: String, required: true },
  roles: [{ type: String, enum: ["Student", "Mentor", "Manager", "Employer", "Course Creator"], required: true }], // Targeted roles
  createdAt: { type: Date, default: Date.now }
});

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
