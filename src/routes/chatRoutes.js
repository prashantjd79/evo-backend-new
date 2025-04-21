
const express = require("express");
const {
	sendMessage,
	getBatchChat,
	sendMessageMentor,
	pinMessage,
	getBatchChatMentor,
	scheduleSession,
	updateScheduledSession,
	cancelScheduledSession,
	getStudentUpcomingSessions,
} = require("../controllers/chatController");

const {
	studentProtect,
	protectMentor,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Student routes
router.post("/send", studentProtect, sendMessage);
router.get("/:batchId", studentProtect, getBatchChat);

// Mentor routes
router.post("/mentor/send", protectMentor, sendMessageMentor);
router.get("/mentor/:batchId", protectMentor, getBatchChatMentor);
router.post("/mentor/pin", protectMentor, pinMessage);
router.post("/mentor/schedule", protectMentor, scheduleSession);
router.put("/mentor/schedule/update", protectMentor, updateScheduledSession);
router.delete(
	"/mentor/schedule/cancel/:batchId/:sessionId",
	protectMentor,
	cancelScheduledSession
);
router.get(
	"/student/upcoming-sessions",
	studentProtect,
	getStudentUpcomingSessions
);
module.exports = router;