// const mongoose = require("mongoose");

// const batchSchema = new mongoose.Schema({
//   course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
//   name: { type: String, required: true },
//   startDate: { type: Date, required: true },
//   endDate: { type: Date, required: true },
//   students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], // Students assigned to batch
//   mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Mentor assigned to batch
//   chatMessages: [
//     {
//       sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//       message: { type: String, required: true },
//       timestamp: { type: Date, default: Date.now },
//     }
//   ]
// },
//  { timestamps: true });

// const Batch = mongoose.model("Batch", batchSchema);

// module.exports = Batch;


const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    time: { type: String }, // e.g., "10:00 AM - 12:00 PM"
    batchWeekType: {
      type: String,
      enum: ["Full Week", "Mon-Fri", "Weekend"],
      default: "Mon-Fri",
    },
    startDate: { type: Date },
    endDate: { type: Date },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // or "Student" based on your model
      },
    ],
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      default: null,
    },
  },
  { timestamps: true }
);

const Batch = mongoose.model("Batch", batchSchema);
module.exports = Batch;

