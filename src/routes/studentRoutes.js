const express = require("express");
const { signupStudent, loginStudent,verifyOtp, getStudentProfile,applyPromoCode,applyPromoCodeAndPurchase,submitAssignment,submitQuiz, enrollInCourse, enrollInPath, getEnrolledCourses,getEnrolledPaths} = require("../controllers/studentController");
const { studentProtect } = require("../middleware/authMiddleware");
const uploadSubmittedAssignment = require("../middleware/uploadSubmittedAssignment");
const uploadStudentPhoto = require("../middleware/uploadStudentPhoto");
const router = express.Router();

router.post("/signup", uploadStudentPhoto.single("photo"), signupStudent);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginStudent);
router.get("/me", studentProtect, getStudentProfile);



// router.post("/submit-assignment", studentProtect, submitAssignment);

router.post(
  "/submit-assignment",
  studentProtect,
  uploadSubmittedAssignment.single("file"),
  submitAssignment
);



router.post("/submit-quiz", studentProtect, submitQuiz);
router.post("/apply-purchase", studentProtect, applyPromoCodeAndPurchase); 
router.post("/course", studentProtect, enrollInCourse); // Student enrolls in a course
router.post("/path", studentProtect, enrollInPath); // Student enrolls in a path
router.get("/enrolled-courses", studentProtect, getEnrolledCourses);
router.get("/enrolled-paths", studentProtect, getEnrolledPaths);


module.exports = router;
