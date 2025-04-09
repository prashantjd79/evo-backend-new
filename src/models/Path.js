// const mongoose = require("mongoose");

// const pathSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   description: { type: String },
//   courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }], // Multiple Courses
//   wannaBeInterest: [{ type: mongoose.Schema.Types.ObjectId, ref: "WannaBeInterest", required: true }] // Multiple references
// }, { timestamps: true });

// const Path = mongoose.model("Path", pathSchema);

// module.exports = Path;


const mongoose = require("mongoose");

const pathSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String },
    photo: { type: String }, // e.g., uploads/paths/banner.jpg
    timing: { type: String }, // e.g., "8 weeks"
    price: { type: Number },

    // ✅ Courses included in this path (ordered list of course IDs)
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true,
      }
    ],

    // ✅ Targeted WannaBeInterest (can support multiple)
    wannaBeInterest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WannaBeInterest",
        required: true,
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Path", pathSchema);
