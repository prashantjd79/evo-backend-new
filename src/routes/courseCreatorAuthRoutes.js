const express = require("express");
const { registerCourseCreator, updateCourseCreatorProfile,loginCourseCreator ,createCourseByCreator,updateCourseByCreator,getAllCourses,deleteCourse} = require("../controllers/courseCreatorAuthController");
const { courseCreatorProtect } = require("../middleware/authMiddleware");
const uploadCourseCreatorPhoto = require("../middleware/uploadCourseCreatorPhoto");
const upload = require("../middleware/multer");
const router = express.Router();

router.post("/signup", uploadCourseCreatorPhoto.single("photo"), registerCourseCreator); // Course Creator sign up
router.post("/login", loginCourseCreator); // Course Creator login after approval
router.post(
    "/create",
    courseCreatorProtect, // your auth middleware
    upload.single("photo"),
    createCourseByCreator
  );
  router.put(
    "/course/update/:id",
    courseCreatorProtect,
    upload.single("photo"), // for image upload
    updateCourseByCreator
  );
  

router.get("/",courseCreatorProtect,getAllCourses);
router.delete("/:courseId", courseCreatorProtect, deleteCourse);
//router.put("/course/update/:id", courseCreatorProtect, upload.single("photo"), updateCourseByCreator);
router.put("/profile", courseCreatorProtect, uploadCourseCreatorPhoto.single("photo"), updateCourseCreatorProfile);
module.exports = router;
