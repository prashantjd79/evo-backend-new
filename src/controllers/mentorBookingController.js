const MentorBooking = require("../models/MentorBooking");
const User = require("../models/User");

// // View Available Mentors
// const getAvailableMentors = async (req, res) => {
//   try {
//     const mentors = await User.find({ role: "Mentor" }).select("name email");
//     res.json(mentors);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Book a Mentor Session
const bookMentorSession = async (req, res) => {
  const { studentId, mentorId, date, timeSlot } = req.body;

  try {
    const mentor = await User.findById(mentorId);
    if (!mentor || mentor.role !== "Mentor") {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const booking = await MentorBooking.create({ student: studentId, mentor: mentorId, date, timeSlot });

    res.status(201).json({ message: "Mentor session booked successfully", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View Student's Booked Sessions
const getStudentBookings = async (req, res) => {
  const { studentId } = req.params;

  try {
    const bookings = await MentorBooking.find({ student: studentId })
      .populate("mentor", "name email")
      .sort({ date: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mentor Confirms or Cancels a Session
const updateBookingStatus = async (req, res) => {
  const { bookingId, status } = req.body;

  try {
    const booking = await MentorBooking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.status = status;
    await booking.save();

    res.json({ message: `Booking status updated to ${status}`, booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMentorBookings = async (req, res) => {
  const { mentorId } = req.params;

  try {
    const bookings = await MentorBooking.find({ mentor: mentorId })
      .populate("student", "name email")
      .sort({ date: 1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {  bookMentorSession, getStudentBookings, getMentorBookings,updateBookingStatus };
