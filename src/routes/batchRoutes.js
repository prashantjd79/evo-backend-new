const express = require("express");
const { createBatch, assignStudentsToBatch, assignMentorToBatch, getBatchesByCourse } = require("../controllers/batchController");
const { adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", adminProtect, createBatch);
router.put("/assign-students", adminProtect, assignStudentsToBatch);
router.put("/assign-mentor", adminProtect, assignMentorToBatch);
router.get("/:courseId", adminProtect, getBatchesByCourse);

module.exports = router;
