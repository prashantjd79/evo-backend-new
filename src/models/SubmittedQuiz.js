const mongoose = require("mongoose");

const submittedQuizSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
  answers: [
    {
      question: { type: String, required: true },
      selectedAnswer: { type: String, required: true },
      correctAnswer: { type: String, required: true },
      isCorrect: { type: Boolean, required: true },
    }
  ],
  score: { type: Number, required: true }, // ✅ Auto-calculated score
});

const SubmittedQuiz = mongoose.model("SubmittedQuiz", submittedQuizSchema);
module.exports = SubmittedQuiz;
