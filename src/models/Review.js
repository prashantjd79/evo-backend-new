// const mongoose = require("mongoose");

// const reviewSchema = new mongoose.Schema({
//   student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
//   course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, 
//   path: { type: mongoose.Schema.Types.ObjectId, ref: "Path" }, 
//   rating: { type: Number, required: true, min: 1, max: 5 }, 
//   reviewText: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const Review = mongoose.model("Review", reviewSchema);

// module.exports = Review;

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  name: { type: String },
  comment: { type: String, trim: true },
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);
