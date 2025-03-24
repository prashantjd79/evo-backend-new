const express = require("express");
const { createCourse,getAllCourses,getCourseById,assignWannaBeInterestToCourse } = require("../controllers/courseController");
const { adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", adminProtect, createCourse);

router.get("/", adminProtect, getAllCourses);
router.get("/:id", adminProtect, getCourseById);
router.put("/assign-wanna-be-interest", adminProtect, assignWannaBeInterestToCourse);
module.exports = router;
