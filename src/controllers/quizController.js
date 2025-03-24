const Quiz = require("../models/Quiz");
const Lesson = require("../models/Lesson");
// Create a new Quiz under a Lesson


const createQuiz = async (req, res) => {
  const { lessonId, quizzes } = req.body; // Accept multiple quizzes as an array

  try {
    // Check if lessonId is valid
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Validate quizzes input
    if (!Array.isArray(quizzes) || quizzes.length === 0) {
      return res.status(400).json({ message: "Invalid quizzes data" });
    }

    // Append quizzes to the existing lesson
    lesson.quizzes.push(...quizzes);
    await lesson.save();

    res.status(201).json({ message: "Quizzes added successfully", lesson });
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
  
const updateQuiz = async (req, res) => {
  const { quizId } = req.params;
  const { question, options, correctAnswer } = req.body;

  try {
    const updatedQuiz = await Lesson.findOneAndUpdate(
      { "quizzes._id": quizId }, 
      {
        $set: {
          "quizzes.$.question": question,
          "quizzes.$.options": options,
          "quizzes.$.correctAnswer": correctAnswer
        }
      },
      { new: true }
    );

    if (!updatedQuiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json({ message: "Quiz updated successfully", updatedQuiz });
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
