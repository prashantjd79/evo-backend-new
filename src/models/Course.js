const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", required: true },
  wannaBeInterest: [{ type: mongoose.Schema.Types.ObjectId, ref: "WannaBeInterest", required: true }]
 // interests: [{ type: mongoose.Schema.Types.ObjectId, ref: "WannaBeInterest" }],
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
