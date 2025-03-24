const express = require("express");
const { registerStudent, loginStudent, getStudentProfile,applyPromoCode,applyPromoCodeAndPurchase,submitAssignment,submitQuiz, enrollInCourse, enrollInPath, getEnrolledCourses,getEnrolledPaths} = require("../controllers/studentController");
const { studentProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/me", studentProtect, getStudentProfile);
//router.post("/apply", studentProtect, applyPromoCode);
router.post("/submit-assignment", studentProtect, submitAssignment);
router.post("/submit-quiz", studentProtect, submitQuiz);
router.post("/apply-purchase", studentProtect, applyPromoCodeAndPurchase); 
router.post("/course", studentProtect, enrollInCourse); // Student enrolls in a course
router.post("/path", studentProtect, enrollInPath); // Student enrolls in a path
router.get("/enrolled-courses", studentProtect, getEnrolledCourses);
router.get("/enrolled-paths", studentProtect, getEnrolledPaths);
//router.put("/update-evo-score", studentProtect, updateEvoScore);

module.exports = router;
