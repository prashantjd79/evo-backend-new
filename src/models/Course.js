// const mongoose = require("mongoose");

// const courseSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
//   subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", required: true },
//   wannaBeInterest: [{ type: mongoose.Schema.Types.ObjectId, ref: "WannaBeInterest", required: true }]
//  // interests: [{ type: mongoose.Schema.Types.ObjectId, ref: "WannaBeInterest" }],
// }, { timestamps: true });

// const Course = mongoose.model("Course", courseSchema);

// module.exports = Course;
const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Renamed from "name"
  description: { type: String },
  whatYouWillLearn: { type: String },
  photo: { type: String }, // stores filename or image path
  youtubeLink: { type: String },
  timing: { type: String },
  // category: { type: mongoose.Schema.Types.ObjectId, ref: "category", required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  wannaBeInterest: [{ type: mongoose.Schema.Types.ObjectId, ref: "WannaBeInterest", required: true }],
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: "Subcategory", required: true },
  realPrice: { type: Number },
  discountedPrice: { type: Number },
  tags: [{ type: String }], // e.g., ["web", "mern"]
  reviews: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
      createdAt: { type: Date, default: Date.now }
    }
  ],
  createdBy: { type: String, default: "Admin" },
}, { timestamps: true });

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
