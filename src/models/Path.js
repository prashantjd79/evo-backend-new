const mongoose = require("mongoose");

const pathSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }], // Multiple Courses
  wannaBeInterest: [{ type: mongoose.Schema.Types.ObjectId, ref: "WannaBeInterest", required: true }] // Multiple references
}, { timestamps: true });

const Path = mongoose.model("Path", pathSchema);

module.exports = Path;
