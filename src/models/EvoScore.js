const mongoose = require("mongoose");

const evoScoreSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  quizScore: { type: Number, default: 0 },
  assignmentScore: { type: Number, default: 0 },
  evoScore: { type: Number, default: 0 }, // Final Evo Score
}, { timestamps: true });

const EvoScore = mongoose.model("EvoScore", evoScoreSchema);
module.exports = EvoScore;
