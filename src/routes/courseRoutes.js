const express = require("express");
const { createCourse,getAllCourses,getCourseById,assignWannaBeInterestToCourse } = require("../controllers/courseController");
const { adminProtect } = require("../middleware/authMiddleware");
const multer = require('multer');
const upload = require("../middleware/multer");



const router = express.Router();

// router.post("/", adminProtect, createCourse);
const setCourseUploadType = (req, res, next) => {
    req.uploadType = "course"; // 🟢 Dynamic folder name
    next();
  };
  
  router.post(
    "/",
    adminProtect,
    setCourseUploadType,
    upload.single("photo"),
    createCourse
  );


router.get("/", adminProtect, getAllCourses);
router.get("/:id", adminProtect, getCourseById);
router.put("/assign-wanna-be-interest", adminProtect, assignWannaBeInterestToCourse);
module.exports = router;
