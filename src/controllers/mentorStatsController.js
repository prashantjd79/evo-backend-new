const User = require("../models/User");
const Batch = require("../models/Batch");
const Course = require("../models/Course");

// Get Mentor Stats for a Manager
const getMentorStats = async (req, res) => {
  const { managerId } = req.params;

  try {
    const manager = await User.findById(managerId).populate("assignedMentors", "name email");
    if (!manager || manager.role !== "Manager") {
      return res.status(404).json({ message: "Manager not found" });
    }

    const mentorStats = await Promise.all(
      manager.assignedMentors.map(async (mentor) => {
        const batches = await Batch.find({ mentor: mentor._id }).populate("students", "name email");
        const totalStudents = batches.reduce((sum, batch) => sum + batch.students.length, 0);
        const coursesAssigned = await Course.find({ mentor: mentor._id }).countDocuments();

        return {
          mentorId: mentor._id,
          name: mentor.name,
          email: mentor.email,
          totalBatches: batches.length,
          totalStudents,
          coursesAssigned
        };
      })
    );

    res.json({ managerId: manager._id, mentorStats });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getMentorStats };
    