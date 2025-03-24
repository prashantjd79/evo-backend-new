const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Employer posting the job
  applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Students applying for the job
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }, // Approval status
  createdAt: { type: Date, default: Date.now }
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
