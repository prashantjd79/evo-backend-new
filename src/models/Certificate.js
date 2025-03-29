// models/Certificate.js
const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  fileUrl: { type: String, required: true }, // File path
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Admin
}, { timestamps: true });

module.exports = mongoose.model("Certificate", certificateSchema);
