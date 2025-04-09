const MentorBooking = require("../models/MentorBooking");
const User = require("../models/User");
const Batch = require("../models/Batch");

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


const replyToStudentSession = async (req, res) => {
  try {
    const mentorId = req.mentor?.id;
; // Ensure it's from protectMentor
    const bookingId = req.params.bookingId;
    const { reply } = req.body;

    const booking = await MentorBooking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    console.log("Booking mentor ID:", booking.mentor);
    console.log("Logged-in mentor ID:", mentorId);

    if (booking.mentor.toString() !== mentorId) {
      return res.status(403).json({ message: "Access denied. Not your booking." });
    }

    booking.reply = reply;
    await booking.save();

    res.json({ message: "Reply sent successfully", booking });
  } catch (error) {
    console.error("Error sending reply:", error);
    res.status(500).json({ message: "Failed to send reply" });
  }
};


const getAssignedBatches = async (req, res) => {
  try {
    const mentorId = req.mentor?.id;

    const batches = await Batch.find({ mentor: mentorId }).populate("course", "title").populate("students", "name email");

    res.json({ batches });
  } catch (error) {
    console.error("Error fetching mentor batches:", error);
    res.status(500).json({ message: "Failed to fetch assigned batches" });
  }
};


const getBatchById = async (req, res) => {
  try {
    const { batchId } = req.params;

    const batch = await Batch.findById(batchId).populate("course students"); // populate course & students only

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    // Manually populate the mentor from User model
    const mentor = batch.mentor ? await User.findById(batch.mentor) : null;

    const populatedBatch = {
      ...batch.toObject(),
      mentor, // override mentor ObjectId with full mentor document
    };

    res.json({ batch: populatedBatch });
  } catch (error) {
    console.error("Error fetching batch:", error);
    res.status(500).json({ message: "Failed to fetch batch" });
  }
};


module.exports = {  bookMentorSession,getBatchById,getAssignedBatches, getStudentBookings, getMentorBookings,updateBookingStatus,replyToStudentSession };
