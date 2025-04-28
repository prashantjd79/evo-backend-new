


// const router = require("express").Router();
// const { createReview } = require("../controllers/reviewController");
// const { studentProtect } = require("../middleware/authMiddleware");

// // Only students allowed
// router.post("/Review", studentProtect, createReview);

// module.exports = router;


const express = require("express");
const { createReview, updateReview, deleteReview,getReviewsByCourseSlug } = require("../controllers/reviewController");
const { studentProtect } = require("../middleware/authMiddleware"); // protect for student login

const router = express.Router();

// Create Review
router.post("/Create", studentProtect, createReview);

// Update Review
router.put("/:reviewId", studentProtect, updateReview);

// Delete Review
router.delete("/:reviewId", studentProtect, deleteReview);
router.get("/course/slug/:slug", getReviewsByCourseSlug);
module.exports = router;
