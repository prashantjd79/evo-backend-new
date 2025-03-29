// const express = require("express");
// const { submitCourseReview, submitPathReview, getCourseReviews, getPathReviews } = require("../controllers/reviewController");
// const { studentProtect } = require("../middleware/authMiddleware");

// const router = express.Router();

// router.post("/course", studentProtect, submitCourseReview); // Submit a course review
// router.post("/path", studentProtect, submitPathReview); // Submit a path review
// router.get("/course/:courseId",  getCourseReviews); // Get course reviews
// router.get("/path/:pathId",  getPathReviews); // Get path reviews

// module.exports = router;


const router = require("express").Router();
const { createReview } = require("../controllers/reviewController");
const { studentProtect } = require("../middleware/authMiddleware");

// Only students allowed
router.post("/", studentProtect, createReview);

module.exports = router;

