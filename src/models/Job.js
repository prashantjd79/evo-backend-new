const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true },
  location: { type: String, required: true },
  jobType: {
    type: String,
    enum: ["Full-Time", "Part-Time", "Internship", "Contract"],
    required: true,
  },
  experienceRequired: { type: String },
  salary: { type: String },
  applicationDeadline: { type: Date, required: true },
  skillsRequired: [{ type: String }],
  openings: { type: Number, default: 1 },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
