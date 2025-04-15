// const mongoose = require("mongoose");

// const jobSchema = new mongoose.Schema({
//   title: { type: String, required: true },
//   description: { type: String, required: true },
//   employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   companyName: { type: String, required: true },
//   location: { type: String, required: true },
//   applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

//   jobType: {
//     type: String,
//     enum: ["Full-Time", "Part-Time", "Internship", "Contract"],
//     required: true,
//   },
//   experienceRequired: { type: String },
//   salary: { type: String },
//   applicationDeadline: { type: Date, required: true },
//   skillsRequired: [{ type: String }],
//   openings: { type: Number, default: 1 },
//   status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
// }, { timestamps: true });

// const Job = mongoose.model("Job", jobSchema);
// module.exports = Job;
const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  employer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyName: { type: String, required: true },
  location: { type: String, required: true },

  // ✅ Updated applicants field to store student ID, resume, and application status
  applicants: [
    {
      student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      resume: { type: String },
      status: {
        type: String,
        enum: ["Pending", "Accepted", "Rejected"],
        default: "Pending"
      }
    }
  ],

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
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
}, { timestamps: true });

const Job = mongoose.model("Job", jobSchema);
module.exports = Job;
