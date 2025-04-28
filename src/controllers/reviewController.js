
// const Review = require("../models/Review");
// const User = require("../models/User");
// const Course = require("../models/Course");



// const mongoose = require("mongoose");

// const createReview = async (req, res) => {
//   const { courseId, rating, comment, name } = req.body; // Accept name directly
//   const userId = req.user._id;

//   if (!courseId || !rating) {
//     return res.status(400).json({ message: "Course ID and rating are required." });
//   }

//   try {
//     const objectId = new mongoose.Types.ObjectId(courseId);

//     const courseExists = await Course.findById(objectId);
//     if (!courseExists) {
//       return res.status(404).json({ message: "Course not found." });
//     }

//     const student = await User.findById(userId);
//     const enrolled = student.enrolledCourses.some(
//       (enrollment) => enrollment.course.toString() === courseId
//     );

//     if (!enrolled) {
//       return res.status(403).json({
//         message: "You can't review because you're not enrolled in this course.",
//       });
//     }

//     const newReview = await Review.create({
//       course: objectId,
//       user: userId,
//       name: name || student.name, // ✅ Use body.name if provided, else fallback
//       rating,
//       comment,
//     });

//     res.status(201).json({
//       message: "Review created successfully.",
//       review: newReview,
//     });

//   } catch (error) {
//     console.error("❌ Review creation failed:", error);
//     res.status(500).json({ message: error.message });
//   }
// };




// module.exports = { createReview };





const Review = require("../models/Review");
const User = require("../models/User");
const Course = require("../models/Course");
const mongoose = require("mongoose");
const slugify = require("slugify");
// ✅ Create Review (your existing)
const createReview = async (req, res) => {
  const { courseId, rating, comment, name } = req.body;
  const userId = req.user._id;

  if (!courseId || !rating) {
    return res.status(400).json({ message: "Course ID and rating are required." });
  }

  try {
    const objectId = new mongoose.Types.ObjectId(courseId);

    const courseExists = await Course.findById(objectId);
    if (!courseExists) {
      return res.status(404).json({ message: "Course not found." });
    }

    const student = await User.findById(userId);
    const enrolled = student.enrolledCourses.some(
      (enrollment) => enrollment.course.toString() === courseId
    );

    if (!enrolled) {
      return res.status(403).json({
        message: "You can't review because you're not enrolled in this course.",
      });
    }

    const newReview = await Review.create({
      course: objectId,
      user: userId,
      name: name || student.name,
      rating,
      comment,
    });

    res.status(201).json({
      message: "Review created successfully.",
      review: newReview,
    });

  } catch (error) {
    console.error("❌ Review creation failed:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update Review
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Check if the logged in user is owner of this review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only update your own reviews." });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    res.json({ message: "Review updated successfully.", review });

  } catch (error) {
    console.error("❌ Review update failed:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete Review
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user._id;

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found." });
    }

    // Check if the logged in user is owner of this review
    if (review.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own reviews." });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted successfully." });

  } catch (error) {
    console.error("❌ Review delete failed:", error);
    res.status(500).json({ message: error.message });
  }
};
const getReviewsByCourseSlug = async (req, res) => {
  try {
    const { slug } = req.params;

    // 🔥 Find course by slug
    const course = await Course.findOne({ slug }).select("_id title");

    if (!course) {
      return res.status(404).json({ message: "Course not found." });
    }

    // 🔥 Now get reviews by course ID
    const reviews = await Review.find({ course: course._id })
      .populate("user", "name email photo") // populate student details
      .sort({ createdAt: -1 }); // latest reviews first

    res.json({ course: course.title, reviews });

  } catch (error) {
    console.error("❌ Get Reviews by Course Slug Error:", error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = { 
  createReview,
  getReviewsByCourseSlug, 
  updateReview, 
  deleteReview 
};
