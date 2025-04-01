const Quiz = require("../models/Quiz");

const Lesson = require("../models/Lesson");
// Create a new Quiz under a Lesson


const updateQuiz = async (req, res) => {
  const { lessonId, quizIndex, question, options, correctAnswer } = req.body;

  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    if (quizIndex < 0 || quizIndex >= lesson.quizzes.length) {
      return res.status(400).json({ message: "Invalid quiz index" });
    }

    // Update the quiz
    const quiz = lesson.quizzes[quizIndex];
    if (question) quiz.question = question;
    if (options) quiz.options = options;
    if (correctAnswer) quiz.correctAnswer = correctAnswer;

    await lesson.save();

    res.json({ message: "Quiz updated successfully", quiz });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const createQuiz = async (req, res) => {
  const { lessonId, quizzes } = req.body;

  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (!Array.isArray(quizzes) || quizzes.length === 0) {
      return res.status(400).json({ message: "Invalid quizzes data" });
    }

    // 🚨 Replace existing quizzes instead of pushing
    lesson.quizzes = quizzes;

    await lesson.save();
    res.status(201).json({
      message: "Quizzes replaced successfully",
      lesson
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




const getQuizzesByLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.json({ lessonId: lesson._id, quizzes: lesson.quizzes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
  

const deleteQuiz = async (req, res) => {
  const { quizId } = req.params;

  try {
    const updatedLesson = await Lesson.findOneAndUpdate(
      { "quizzes._id": quizId },
      { $pull: { quizzes: { _id: quizId } } },
      { new: true }
    );

    if (!updatedLesson) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  



module.exports = { createQuiz, getQuizzesByLesson,updateQuiz, deleteQuiz };
