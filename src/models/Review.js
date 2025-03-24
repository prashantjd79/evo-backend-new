const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, 
  path: { type: mongoose.Schema.Types.ObjectId, ref: "Path" }, 
  rating: { type: Number, required: true, min: 1, max: 5 }, 
  reviewText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
