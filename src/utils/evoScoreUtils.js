// const EvoScore = require("../models/EvoScore");
// const SubmittedQuiz = require("../models/SubmittedQuiz");
// const SubmittedAssignment = require("../models/SubmittedAssignment");

// const updateEvoScore = async (studentId) => {
//   try {
//     console.log("🔄 Updating Evo Score for Student:", studentId);

//     // ✅ Fetch all quizzes & assignments
//     const quizSubmissions = await SubmittedQuiz.find({ student: studentId });
//     const assignmentSubmissions = await SubmittedAssignment.find({ student: studentId });

//     // ✅ Calculate average quiz & assignment score
//     const totalQuizScore = quizSubmissions.reduce((sum, quiz) => sum + (quiz.score || 0), 0);
//     const quizCount = quizSubmissions.length;
//     const avgQuizScore = quizCount > 0 ? totalQuizScore / quizCount : 0;

//     const totalAssignmentScore = assignmentSubmissions.reduce((sum, assignment) => sum + (assignment.score || 0), 0);
//     const assignmentCount = assignmentSubmissions.length;
//     const avgAssignmentScore = assignmentCount > 0 ? totalAssignmentScore / assignmentCount : 0;

//     // ✅ Final Evo Score = (50% Quiz + 50% Assignment)
//     const evoScore = (avgQuizScore + avgAssignmentScore) / 2;
//     console.log(`✅ Calculated Evo Score: ${evoScore}`);

//     // ✅ Update or Create EvoScore Document
//     const updatedEvoScore = await EvoScore.findOneAndUpdate(
//       { student: studentId },
//       { quizScore: avgQuizScore, assignmentScore: avgAssignmentScore, evoScore },
//       { new: true, upsert: true }
//     );

//     console.log("✅ Updated Evo Score in DB:", updatedEvoScore.evoScore);

//   } catch (error) {
//     console.error("❌ Error updating Evo Score:", error.message);
//   }
// };

// module.exports = { updateEvoScore };

const EvoScore = require("../models/EvoScore");
const SubmittedQuiz = require("../models/SubmittedQuiz");
const SubmittedAssignment = require("../models/SubmittedAssignment");

const updateEvoScore = async (studentId) => {
  try {
    console.log("🔄 Updating Evo Score for Student:", studentId);

    // ✅ Get the latest quiz per lesson
    const quizzes = await SubmittedQuiz.aggregate([
      { $match: { student: studentId } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$lesson", // group by lesson
          score: { $first: "$score" },
        },
      },
    ]);

    const quizScores = quizzes.map((q) => q.score || 0);
    const avgQuizScore = quizScores.length > 0
      ? quizScores.reduce((a, b) => a + b, 0) / quizScores.length
      : 0;

    // ✅ Get the latest assignment per lesson
    const assignments = await SubmittedAssignment.aggregate([
      { $match: { student: studentId, score: { $ne: null } } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$lesson",
          score: { $first: "$score" },
        },
      },
    ]);

    const assignmentScores = assignments.map((a) => a.score || 0);
    const avgAssignmentScore = assignmentScores.length > 0
      ? assignmentScores.reduce((a, b) => a + b, 0) / assignmentScores.length
      : 0;

    // ✅ Final Evo Score = (Quiz + Assignment) / 2
    const evoScore = (avgQuizScore + avgAssignmentScore) / 2;

    // ✅ Save or Update EvoScore record
    const updated = await EvoScore.findOneAndUpdate(
      { student: studentId },
      {
        quizScore: parseFloat(avgQuizScore.toFixed(2)),
        assignmentScore: parseFloat(avgAssignmentScore.toFixed(2)),
        evoScore: parseFloat(evoScore.toFixed(2)),
      },
      { new: true, upsert: true }
    );

    console.log("✅ Quiz Scores:", quizScores);
    console.log("✅ Assignment Scores:", assignmentScores);
    console.log("✅ Final Evo Score:", updated.evoScore);

  } catch (error) {
    console.error("❌ Error updating Evo Score:", error.message);
  }
};

module.exports = { updateEvoScore };
