const express = require("express");
const { registerMentor, loginMentor,getSubmittedAssignments,getApprovedBlogs,getReviewsByCourseId,gradeAssignment,getMyProfileByRole} = require("../controllers/mentorController");
const { protectMentor, adminProtect,studentProtect,
    employerProtect,
    courseCreatorProtect,
    publisherProtect,
    managerProtect } = require("../middleware/authMiddleware");
const uploadMentorPhoto = require("../middleware/uploadMentorPhoto");
const router = express.Router();

// router.post("/register", registerMentor);

router.post("/signup", uploadMentorPhoto.single("photo"), registerMentor);

router.post("/login", loginMentor);
router.get("/submitted-assignments",adminProtect, protectMentor, getSubmittedAssignments);
router.post("/grade-assignment", protectMentor, gradeAssignment);


router.get("/mentor/me", protectMentor, getMyProfileByRole);
router.get("/student/me", studentProtect, getMyProfileByRole);
router.get("/employer/me", employerProtect, getMyProfileByRole);
router.get("/coursecreator/me", courseCreatorProtect, getMyProfileByRole);
router.get("/publisher/me", publisherProtect, getMyProfileByRole);
router.get("/manager/me", managerProtect, getMyProfileByRole);
router.get("/course/:courseId", getReviewsByCourseId);
router.get("/approved", getApprovedBlogs);

module.exports = router;
