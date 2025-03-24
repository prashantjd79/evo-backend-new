const express = require("express");
const { registerMentor, loginMentor,getSubmittedAssignments,gradeAssignment } = require("../controllers/mentorController");
const { protectMentor } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", registerMentor);
router.post("/login", loginMentor);
router.get("/submitted-assignments", protectMentor, getSubmittedAssignments);
router.post("/grade-assignment", protectMentor, gradeAssignment);

module.exports = router;
