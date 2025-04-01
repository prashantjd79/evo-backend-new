const express = require("express");
const { createQuiz, getQuizzesByLesson, deleteQuiz,updateQuiz } = require("../controllers/quizController");
const { adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/",adminProtect, createQuiz);
router.get("/:lessonId", adminProtect, getQuizzesByLesson);
router.delete("/quiz/:quizId", adminProtect, deleteQuiz);
router.put("/quiz", adminProtect, updateQuiz);
module.exports = router;
