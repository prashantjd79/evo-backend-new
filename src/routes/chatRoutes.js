const express = require("express");
const { sendMessage, getBatchChat } = require("../controllers/chatController");
const { studentProtect } = require("../middleware/authMiddleware");
const { protectMentor } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/send", studentProtect, sendMessage);
 // Send a message
router.get("/:batchId", studentProtect, protectMentor,getBatchChat); // Get all messages for a batch

module.exports = router;
