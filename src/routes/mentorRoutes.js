const express = require("express");
const { registerMentor, loginMentor,getSubmittedAssignments,gradeAssignment } = require("../controllers/mentorController");
const { protectMentor, adminProtect } = require("../middleware/authMiddleware");
const uploadMentorPhoto = require("../middleware/uploadMentorPhoto");
const router = express.Router();

// router.post("/register", registerMentor);

router.post("/signup", uploadMentorPhoto.single("photo"), registerMentor);

router.post("/login", loginMentor);
router.get("/submitted-assignments",adminProtect, protectMentor, getSubmittedAssignments);
router.post("/grade-assignment", protectMentor, gradeAssignment);

module.exports = router;
