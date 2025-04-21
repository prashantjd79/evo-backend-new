const express = require("express");
const { createCourse,updateCourseByAdmin,getAllCourses,getCourseById,assignWannaBeInterestToCourse } = require("../controllers/courseController");
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


router.get("/", getAllCourses);
router.get("/:id", adminProtect, getCourseById);
router.put("/assign-wanna-be-interest", adminProtect, assignWannaBeInterestToCourse);
router.put("/course/update/:id", adminProtect, upload.single("photo"), updateCourseByAdmin);
module.exports = router;
