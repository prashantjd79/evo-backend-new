const express = require("express");
const { signupStudent,getMyCourseProgress,getStudentLessonScores,getStudentApplications,getApprovedJobsForStudents,getMyMentorBookings,getMyBatches,getBatchById,loginStudent,verifyOtp,getLessonsByCourseForStudent,getMyCertificates,getAllCoursesForStudents,getMyEnrolledCourses,getStudentProfile,applyPromoCode,applyPromoCodeAndPurchase,submitAssignment,submitQuiz, enrollInCourse, enrollInPath, getEnrolledCourses,getEnrolledPaths} = require("../controllers/studentController");
const { studentProtect } = require("../middleware/authMiddleware");
const uploadSubmittedAssignment = require("../middleware/uploadSubmittedAssignment");
const uploadStudentPhoto = require("../middleware/uploadStudentPhoto");
const router = express.Router();

router.post("/signup", uploadStudentPhoto.single("photo"), signupStudent);
router.post("/verify-otp", verifyOtp);
router.post("/login", loginStudent);
router.get("/me", studentProtect, getStudentProfile);
router.get("/lessons/:courseId", studentProtect, getLessonsByCourseForStudent);
router.get("/batches", studentProtect, getMyBatches);
router.get("/batches/:batchId",studentProtect, getBatchById);
// router.post("/submit-assignment", studentProtect, submitAssignment);

router.post(
  "/submit-assignment",
  studentProtect,
  uploadSubmittedAssignment.single("file"),
  submitAssignment
);
router.get("/courses", studentProtect, getAllCoursesForStudents);
router.get("/enrolled-courses", studentProtect, getMyEnrolledCourses);

router.post("/submit-quiz", studentProtect, submitQuiz);
router.post("/apply-purchase", studentProtect, applyPromoCodeAndPurchase); 
router.post("/course", studentProtect, enrollInCourse); // Student enrolls in a course
router.post("/path", studentProtect, enrollInPath); // Student enrolls in a path
router.get("/enroll/enrolled-courses/", studentProtect, getEnrolledCourses);
router.get("/enrolled-paths", studentProtect, getEnrolledPaths);
router.get("/certificates", studentProtect, getMyCertificates);
router.get("/jobs", studentProtect, getApprovedJobsForStudents);
router.get("/my-mentor-sessions", studentProtect, getMyMentorBookings);
router.get("/my-applications", studentProtect, getStudentApplications);
router.get("/my-progress", studentProtect, getMyCourseProgress);
router.get("/scores/:lessonId", studentProtect, getStudentLessonScores);
module.exports = router;
