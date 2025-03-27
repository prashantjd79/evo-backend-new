const express = require("express");
const { registerCourseCreator, loginCourseCreator ,createCourse,updateCourse,getAllCourses,deleteCourse} = require("../controllers/courseCreatorAuthController");
const { courseCreatorProtect } = require("../middleware/authMiddleware");
const uploadCourseCreatorPhoto = require("../middleware/uploadCourseCreatorPhoto");
const router = express.Router();

router.post("/signup", uploadCourseCreatorPhoto.single("photo"), registerCourseCreator); // Course Creator sign up
router.post("/login", loginCourseCreator); // Course Creator login after approval
router.post("/create", courseCreatorProtect, createCourse);
router.put("/:courseId", courseCreatorProtect, updateCourse);
router.get("/",courseCreatorProtect,getAllCourses);
router.delete("/:courseId", courseCreatorProtect, deleteCourse);


module.exports = router;
