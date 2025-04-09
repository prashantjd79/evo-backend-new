const mongoose = require("mongoose");

const mentorBookingSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  date: { type: Date, required: true }, 
  timeSlot: { type: String, required: true }, 
  status: { type: String, enum: ["Pending", "Confirmed", "Cancelled"], default: "Pending" },
  createdAt: { type: Date, default: Date.now },
 // sessionDate: { type: Date, required: true },
  messageFromStudent: { type: String },
  replyFromMentor: { type: String },
});

const MentorBooking = mongoose.model("MentorBooking", mentorBookingSchema);

module.exports = MentorBooking;
