const express = require("express");
const { registerAdmin,toggleUserBanStatus,updateAdminProfile,markTransactionAsPaid,createTransaction,getUserProfileById,getAllReviews,getBatchStudents,getAssignmentByLessonId,deleteBatch,deleteCourse,deletePromoCode,deleteTicket,deleteAnnouncement,getAllStudentsProgress,addReviewByAdmin,getAdminProfile,loginAdmin,getAllCategories,getAllSubcategories,getAllWannaBeInterests,getMyAdminProfile,getAllCourses,getAllCourseCreators,approveUser,getPendingApprovals,approveMentor,getPendingMentors,
    getUserProfile,getAllCertificates,getAllJobs,getCoursesWithDetails,getUsersByRole,getBatchesByCourseId,getAllBatches,getStudentsByCourseId ,getPlatformAnalytics,getAllSubmittedAssignments, updateUserStatus,getTransactions,assignMentorsToManager, exportTransactionsCSV,getAllBlogs,approveOrRejectBlog,
    
} = require("../controllers/adminController");
const { adminProtect } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer"); // or your upload middleware path

const router = express.Router();

router.post("/register", registerAdmin);
router.get("/blogs", adminProtect, getAllBlogs);
router.put("/blogs/:blogId", adminProtect, approveOrRejectBlog);
router.post("/login", loginAdmin);
router.put("/approve-user", adminProtect, approveUser);
router.get("/pending-approvals", adminProtect, getPendingApprovals);
router.get("/me", adminProtect, getMyAdminProfile);
router.get("/admin/all-progress", adminProtect, getAllStudentsProgress);
router.put("/approve", adminProtect, approveMentor);
router.get("/pending", adminProtect, getPendingMentors);

router.get("/jobs", adminProtect, getAllJobs);
router.get("/profile/:userId", adminProtect, getUserProfile); // Get specific user profile
router.get("/role/:role", adminProtect, getUsersByRole); // Get all users by role
router.get("/analytics", adminProtect, getPlatformAnalytics); // Get platform-wide analytics
router.put("/status", adminProtect, updateUserStatus); // Update user status (Active/Inactive/Banned)
router.get("/courses", adminProtect, getCoursesWithDetails);
router.get("/", adminProtect, getTransactions); // Get transactions (filtered by Course & Path)
 // Export transactions as CSV
router.put("/assign-mentors", adminProtect, assignMentorsToManager);
router.get("/assignments", adminProtect, getAllSubmittedAssignments);
router.get("/certificates", adminProtect, getAllCertificates);
router.get("/batches/by-course/:courseId", adminProtect, getBatchesByCourseId);
router.get("/batches", adminProtect, getAllBatches);
router.get("/students/by-course/:courseId", adminProtect, getStudentsByCourseId);
router.get("/course-creators", adminProtect, getAllCourseCreators);
router.get("/Allcourses", getAllCourses);
router.get("/allcat", getAllCategories);
router.get("/allsubcat", getAllSubcategories);
router.get("/allwanna", getAllWannaBeInterests);
router.get("/me", adminProtect, getAdminProfile);
router.get("/transactions/export", adminProtect, exportTransactionsCSV);
router.get("/transactions", adminProtect, getTransactions);
router.post("/review", adminProtect, addReviewByAdmin);
router.delete("/batch/:id",adminProtect, deleteBatch);
router.delete("/course/:id",adminProtect, deleteCourse);
router.delete("/promocode/:id",adminProtect, deletePromoCode);
router.delete("/ticket/:id",adminProtect, deleteTicket);
router.delete("/announcement/:id",adminProtect, deleteAnnouncement);
router.get("/by-lesson/:lessonId", getAssignmentByLessonId);
router.get("/admin/batch/:batchId/students",adminProtect, getBatchStudents);
router.get("/reviews", getAllReviews);
router.get("/user-profile/:id", adminProtect, getUserProfileById);
//router.put("/course/update/:id", adminProtect, upload.single("photo"), updateCourse);
router.put("/ban-user/:id", adminProtect, toggleUserBanStatus);
router.post("/transactions", createTransaction);
router.put("/transactions/:id/mark-paid", markTransactionAsPaid);
router.put("/profile", adminProtect, upload.single("photo"), updateAdminProfile);
module.exports = router;
