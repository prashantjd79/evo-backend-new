const express = require("express");
const { createLesson, getLessonsByCourse, deleteLesson } = require("../controllers/lessonController");
const { adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", adminProtect, createLesson);
router.get("/:courseId", adminProtect, getLessonsByCourse);
router.delete("/:lessonId", adminProtect, deleteLesson);

module.exports = router;
