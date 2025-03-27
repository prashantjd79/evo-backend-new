const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  image: { type: String }, // uploaded image path
  roles: [{ 
    type: String,
    enum: ["Manager", "Mentor", "Publisher", "Course Creator", "Employer", "Creator", "Student"]
  }]
}, { timestamps: true });

const Announcement = mongoose.model("Announcement", announcementSchema);
module.exports = Announcement;
