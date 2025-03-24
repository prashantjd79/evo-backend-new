const EvoScore = require("../models/EvoScore");
const SubmittedQuiz = require("../models/SubmittedQuiz");
const SubmittedAssignment = require("../models/SubmittedAssignment");

const updateEvoScore = async (studentId) => {
  try {
    console.log("🔄 Updating Evo Score for Student:", studentId);

    // ✅ Fetch all quizzes & assignments
    const quizSubmissions = await SubmittedQuiz.find({ student: studentId });
    const assignmentSubmissions = await SubmittedAssignment.find({ student: studentId });

    // ✅ Calculate average quiz & assignment score
    const totalQuizScore = quizSubmissions.reduce((sum, quiz) => sum + (quiz.score || 0), 0);
    const quizCount = quizSubmissions.length;
    const avgQuizScore = quizCount > 0 ? totalQuizScore / quizCount : 0;

    const totalAssignmentScore = assignmentSubmissions.reduce((sum, assignment) => sum + (assignment.score || 0), 0);
    const assignmentCount = assignmentSubmissions.length;
    const avgAssignmentScore = assignmentCount > 0 ? totalAssignmentScore / assignmentCount : 0;

    // ✅ Final Evo Score = (50% Quiz + 50% Assignment)
    const evoScore = (avgQuizScore + avgAssignmentScore) / 2;
    console.log(`✅ Calculated Evo Score: ${evoScore}`);

    // ✅ Update or Create EvoScore Document
    const updatedEvoScore = await EvoScore.findOneAndUpdate(
      { student: studentId },
      { quizScore: avgQuizScore, assignmentScore: avgAssignmentScore, evoScore },
      { new: true, upsert: true }
    );

    console.log("✅ Updated Evo Score in DB:", updatedEvoScore.evoScore);

  } catch (error) {
    console.error("❌ Error updating Evo Score:", error.message);
  }
};

module.exports = { updateEvoScore };
