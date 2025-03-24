// const mongoose = require("mongoose");

// const submittedAssignmentSchema = new mongoose.Schema({
//   student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
//   lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
//   fileUrl: { type: String, required: true }, // ✅ File submitted by student
//   status: { type: String, enum: ["Pending", "Reviewed"], default: "Pending" },
//   score: { type: Number, default: null }, // ✅ Mentor will assign score
// });

// const SubmittedAssignment = mongoose.model("SubmittedAssignment", submittedAssignmentSchema);
// module.exports = SubmittedAssignment;


const mongoose = require("mongoose");

const submittedAssignmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // ✅ Change "Student" to "User"
  lesson: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
  fileUrl: { type: String, required: true },
  feedback: { type: String },
  score: { type: Number },
  
});

const SubmittedAssignment = mongoose.model("SubmittedAssignment", submittedAssignmentSchema);
module.exports = SubmittedAssignment;
