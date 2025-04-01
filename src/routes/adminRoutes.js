const express = require("express");
const { registerAdmin, loginAdmin ,getAllCourseCreators,approveUser,getPendingApprovals,approveMentor,getPendingMentors,
    getUserProfile,getAllCertificates,getAllJobs,getCoursesWithDetails,getUsersByRole,getBatchesByCourseId,getAllBatches,getStudentsByCourseId ,getPlatformAnalytics,getAllSubmittedAssignments, updateUserStatus,getTransactions,assignMentorsToManager, exportTransactionsCSV,getAllBlogs,approveOrRejectBlog
} = require("../controllers/adminController");
const { adminProtect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerAdmin);
router.get("/blogs", adminProtect, getAllBlogs);
router.put("/blogs/:blogId", adminProtect, approveOrRejectBlog);
router.post("/login", loginAdmin);
router.put("/approve-user", adminProtect, approveUser);
router.get("/pending-approvals", adminProtect, getPendingApprovals);

router.put("/approve", adminProtect, approveMentor);
router.get("/pending", adminProtect, getPendingMentors);

router.get("/jobs", adminProtect, getAllJobs);
router.get("/profile/:userId", adminProtect, getUserProfile); // Get specific user profile
router.get("/role/:role", adminProtect, getUsersByRole); // Get all users by role
router.get("/analytics", adminProtect, getPlatformAnalytics); // Get platform-wide analytics
router.put("/status", adminProtect, updateUserStatus); // Update user status (Active/Inactive/Banned)
router.get("/courses", adminProtect, getCoursesWithDetails);
router.get("/", adminProtect, getTransactions); // Get transactions (filtered by Course & Path)
router.get("/export", adminProtect, exportTransactionsCSV); // Export transactions as CSV
router.put("/assign-mentors", adminProtect, assignMentorsToManager);
router.get("/assignments", adminProtect, getAllSubmittedAssignments);
router.get("/certificates", adminProtect, getAllCertificates);
router.get("/batches/by-course/:courseId", adminProtect, getBatchesByCourseId);
router.get("/batches", adminProtect, getAllBatches);
router.get("/students/by-course/:courseId", adminProtect, getStudentsByCourseId);
router.get("/course-creators", adminProtect, getAllCourseCreators);
module.exports = router;
