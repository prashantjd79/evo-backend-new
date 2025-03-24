const Batch = require("../models/Batch");
const Course = require("../models/Course");
const User = require("../models/User");

const createBatch = async (req, res) => {
    const { courseId, name, startDate, endDate } = req.body;
  
    try {
      // Validate courseId
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      // Create batch only if courseId is valid
      const batch = await Batch.create({
        course: courseId,
        name,
        startDate,
        endDate,
        students: [], // Default empty student array
        mentor: null, // Default no mentor assigned
      });
  
      res.status(201).json({ message: "Batch created successfully", batch });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const assignStudentsToBatch = async (req, res) => {
    const { batchId, studentIds } = req.body; // Expect an array of student IDs
  
    try {
      // ✅ Validate batchId
      const batch = await Batch.findById(batchId);
      if (!batch) {
        return res.status(404).json({ message: "Batch not found" });
      }
  
      // ✅ Validate each studentId (from User collection)
      const validStudents = await User.find({ _id: { $in: studentIds }, role: "Student" });
  
      // ✅ If some student IDs are invalid, return an error
      if (validStudents.length !== studentIds.length) {
        return res.status(400).json({ message: "Some student IDs are invalid" });
      }
  
      // ✅ Assign validated student IDs to the batch (Ensure uniqueness)
      batch.students = [...new Set([...batch.students.map(id => id.toString()), ...studentIds])]; 
      await batch.save();
  
      res.json({ message: "Students assigned successfully", batch });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  

// Assign Mentor to a Batch
const assignMentorToBatch = async (req, res) => {
  const { batchId, mentorId } = req.body;

  try {
    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    batch.mentor = mentorId;
    await batch.save();

    res.json({ message: "Mentor assigned successfully", batch });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Batches of a Course
const getBatchesByCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const batches = await Batch.find({ course: courseId })
      .populate("students", "name email") // Populate student details
      .populate("mentor", "name email") // Populate mentor details
      .populate("course", "name");

    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBatch, assignStudentsToBatch, assignMentorToBatch, getBatchesByCourse };
