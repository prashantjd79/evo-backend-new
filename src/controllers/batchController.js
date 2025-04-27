const Batch = require("../models/Batch");
const Course = require("../models/Course");
const User = require("../models/User");
const slugify = require("slugify");



// const createBatch = async (req, res) => {
//   const { name, courseId, description, time, batchWeekType, startDate, endDate } = req.body;

//   try {
//     const course = await Course.findById(courseId);
//     if (!course) {
//       return res.status(404).json({ message: "Course not found" });
//     }

//     const batch = await Batch.create({
//       name,
//       description,
//       time,
//       batchWeekType,
//       startDate,
//       endDate,
//       course: courseId,
//       students: [],
//       mentor: null,
//     });

//     res.status(201).json({
//       message: "Batch created successfully",
//       batch: {
//         _id: batch._id,
//         name: batch.name,
//         description: batch.description,
//         time: batch.time,
//         batchWeekType: batch.batchWeekType,
//         startDate: batch.startDate,
//         endDate: batch.endDate,
//         course: batch.course,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const createBatch = async (req, res) => {
  const { name, courseId, description, time, batchWeekType, startDate, endDate } = req.body;

  try {
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // 🟢 Generate Slug from Batch Name
    let generatedSlug = slugify(name, { lower: true, strict: true });

    // 🟢 Check if a batch with same slug already exists
    const existingBatch = await Batch.findOne({ slug: generatedSlug });
    if (existingBatch) {
      // If slug exists, add random 4-digit number
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      generatedSlug = `${generatedSlug}-${randomSuffix}`;
    }

    const batch = await Batch.create({
      name,
      slug: generatedSlug, // 🟢 Save slug here
      description,
      time,
      batchWeekType,
      startDate,
      endDate,
      course: courseId,
      students: [],
      mentor: null,
    });

    res.status(201).json({
      message: "Batch created successfully",
      batch: {
        _id: batch._id,
        name: batch.name,
        slug: batch.slug, // 🟢 return slug also
        description: batch.description,
        time: batch.time,
        batchWeekType: batch.batchWeekType,
        startDate: batch.startDate,
        endDate: batch.endDate,
        course: batch.course,
      },
    });
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
const updateBatch = async (req, res) => {
  try {
    const batchId = req.params.id;
    const {
      name,
      description,
      time,
      batchWeekType,
      startDate,
      endDate,
      courseId,
    } = req.body;

    const batch = await Batch.findById(batchId);
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    // Update name & slug if name changed
    if (name && name !== batch.name) {
      let generatedSlug = slugify(name, { lower: true, strict: true });

      const existingBatch = await Batch.findOne({ slug: generatedSlug, _id: { $ne: batchId } });
      if (existingBatch) {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        generatedSlug = `${generatedSlug}-${randomSuffix}`;
      }

      batch.name = name;
      batch.slug = generatedSlug;
    }

    if (description) batch.description = description;
    if (time) batch.time = time;
    if (batchWeekType) batch.batchWeekType = batchWeekType;
    if (startDate) batch.startDate = startDate;
    if (endDate) batch.endDate = endDate;
    if (courseId) batch.course = courseId;

    await batch.save();

    res.json({ message: "Batch updated successfully", batch });

  } catch (error) {
    console.error("❌ Batch update failed:", error);
    res.status(500).json({ message: error.message });
  }
};
module.exports = { createBatch, assignStudentsToBatch, assignMentorToBatch, getBatchesByCourse ,updateBatch};
