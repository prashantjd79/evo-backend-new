const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }], // Students assigned to batch
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Mentor assigned to batch
  chatMessages: [
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now },
    }
  ]
},
 { timestamps: true });

const Batch = mongoose.model("Batch", batchSchema);

module.exports = Batch;
