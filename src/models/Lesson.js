// 

const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    videoUrl: { type: String, default: "" },
    quizzes: [
      {
        question: { type: String, required: true },
        options: [{ type: String, required: true }],
        correctAnswer: { type: String, required: true },
      }
    ],
    assignments: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
        attachmentUrl: { type: String }
      }
    ],
    resources: [{ type: String }],
  },
  { timestamps: true }
);

const Lesson = mongoose.model("Lesson", lessonSchema);
module.exports = Lesson;
