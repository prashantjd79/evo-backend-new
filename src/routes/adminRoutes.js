const express = require("express");
const { registerAdmin, loginAdmin ,approveUser,getPendingApprovals,approveMentor,getPendingMentors,
    getUserProfile, getUsersByRole, getPlatformAnalytics, updateUserStatus,getTransactions,assignMentorsToManager, exportTransactionsCSV,getAllBlogs,approveOrRejectBlog
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


router.get("/profile/:userId", adminProtect, getUserProfile); // Get specific user profile
router.get("/role/:role", adminProtect, getUsersByRole); // Get all users by role
router.get("/analytics", adminProtect, getPlatformAnalytics); // Get platform-wide analytics
router.put("/status", adminProtect, updateUserStatus); // Update user status (Active/Inactive/Banned)

router.get("/", adminProtect, getTransactions); // Get transactions (filtered by Course & Path)
router.get("/export", adminProtect, exportTransactionsCSV); // Export transactions as CSV
router.put("/assign-mentors", adminProtect, assignMentorsToManager);

module.exports = router;
