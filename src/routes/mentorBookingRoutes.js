const express = require("express");
const {  bookMentorSession,getBatchById,replyToStudentSession,getAssignedBatches, getStudentBookings, updateBookingStatus,getMentorBookings } = require("../controllers/mentorBookingController");
const {  studentProtect, protectMentor } = require("../middleware/authMiddleware");
const MentorBooking = require("../models/MentorBooking");

const router = express.Router();

//router.get("/available", protect, getAvailableMentors); // Get available mentors
router.post("/book", studentProtect, bookMentorSession); // Book a mentor session
router.get("/student/:studentId", protectMentor, getStudentBookings); // View student's booked sessions
router.put("/update-status", protectMentor, updateBookingStatus); // Mentor updates booking status
router.put("/reply-booking/:bookingId", protectMentor, replyToStudentSession);
router.get("/my-batches", protectMentor, getAssignedBatches);
router.get("batch/:batchId",protectMentor, getBatchById);

router.get("/:mentorId", protectMentor, getMentorBookings); 
module.exports = router;
