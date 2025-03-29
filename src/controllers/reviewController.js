// const Review = require("../models/Review");
// const Course = require("../models/Course");
// const Path = require("../models/Path");

// const submitCourseReview = async (req, res) => {
//     const { courseId, rating, reviewText } = req.body; // ✅ Removed `studentId`
  
//     try {
//       // ✅ Ensure student is authenticated
//       if (!req.student || !req.student.id) {
//         return res.status(401).json({ message: "Unauthorized: No student ID found in token" });
//       }
  
//       const course = await Course.findById(courseId);
//       if (!course) return res.status(404).json({ message: "Course not found" });
  
//       // ✅ Prevent duplicate reviews
//       const existingReview = await Review.findOne({ student: req.student.id, course: courseId });
//       if (existingReview) {
//         return res.status(400).json({ message: "You have already reviewed this course" });
//       }
  
//       // ✅ Create the review with the correct student ID
//       const review = await Review.create({
//         student: req.student.id,
//         course: courseId,
//         rating,
//         reviewText,
//       });
  
//       res.status(201).json({ message: "Review submitted successfully", review });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
//   const submitPathReview = async (req, res) => {
//     const { pathId, rating, reviewText } = req.body; // ✅ Removed `studentId`
  
//     try {
//       // ✅ Ensure student is authenticated
//       if (!req.student || !req.student.id) {
//         return res.status(401).json({ message: "Unauthorized: No student ID found in token" });
//       }
  
//       const path = await Path.findById(pathId);
//       if (!path) return res.status(404).json({ message: "Path not found" });
  
//       // ✅ Prevent duplicate reviews
//       const existingReview = await Review.findOne({ student: req.student.id, path: pathId });
//       if (existingReview) {
//         return res.status(400).json({ message: "You have already reviewed this path" });
//       }
  
//       // ✅ Create the review with the correct student ID
//       const review = await Review.create({
//         student: req.student.id,
//         path: pathId,
//         rating,
//         reviewText,
//       });
  
//       res.status(201).json({ message: "Review submitted successfully", review });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };
  

// // Get Reviews for a Course
// const getCourseReviews = async (req, res) => {
//   const { courseId } = req.params;

//   try {
//     const reviews = await Review.find({ course: courseId }).populate("student", "name email");
//     res.json(reviews);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Get Reviews for a Path
// const getPathReviews = async (req, res) => {
//   const { pathId } = req.params;

//   try {
//     const reviews = await Review.find({ path: pathId }).populate("student", "name email");
//     res.json(reviews);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { submitCourseReview, submitPathReview, getCourseReviews, getPathReviews };


// controllers/reviewController.js










// const Review = require("../models/Review");
// const User = require("../models/User");
// const Course = require("../models/Course");

// const createReview = async (req, res) => {
//   const { courseId, rating, comment } = req.body;
//   const userId = req.user._id;

//   if (!courseId || !rating) {
//     return res.status(400).json({ message: "Course ID and rating are required." });
//   }

//   try {
//     const courseExists = await Course.findById(courseId);
//     if (!courseExists) {
//       return res.status(404).json({ message: "Course not found." });
//     }

//     const student = await User.findById(userId);
//     const enrolled = student.enrolledCourses.some((enrollment) =>
//       enrollment.course.toString() === courseId
//     );

//     if (!enrolled) {
//       return res.status(403).json({
//         message: "You can't review because you're not enrolled in this course.",
//       });
//     }

//     const newReview = await Review.create({
//       course: courseId,
//       user: userId,
//       rating,
//       comment,
//     });

//     res.status(201).json({
//       message: "Review created successfully.",
//       review: newReview,
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = { createReview };













const Review = require("../models/Review");
const User = require("../models/User");
const Course = require("../models/Course");

const createReview = async (req, res) => {
  const { courseId, rating, comment } = req.body;
  const userId = req.user._id;

  if (!courseId || !rating) {
    return res.status(400).json({ message: "Course ID and rating are required." });
  }

  try {
    const courseExists = await Course.findById(courseId);
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found." });
    }

    const student = await User.findById(userId);
    const enrolled = student.enrolledCourses.some((enrollment) =>
      enrollment.course.toString() === courseId
    );

    if (!enrolled) {
      return res.status(403).json({
        message: "You can't review because you're not enrolled in this course.",
      });
    }

    const newReview = await Review.create({
      course: courseId,
      user: userId,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review created successfully.",
      review: newReview,
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview };
