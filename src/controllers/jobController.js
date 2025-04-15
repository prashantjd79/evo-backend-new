const Job = require("../models/Job");
const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");






const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      employer, // this should be ObjectId string
      companyName,
      location,
      jobType,
      experienceRequired,
      salary,
      applicationDeadline,
      skillsRequired,
      openings
    } = req.body;

    console.log("📥 Incoming Job Payload:", req.body);

    // ✅ Validate employer ID format
    if (!mongoose.Types.ObjectId.isValid(employer)) {
      console.log("❌ Invalid Employer ID Format:", employer);
      return res.status(400).json({ message: "Invalid Employer ID format" });
    }

    // ✅ Check if employer exists and is approved
    const employerUser = await User.findOne({ _id: employer, role: "Employer", isApproved: true });

    if (!employerUser) {
      console.log("❌ Employer not found or not approved:", employer);
      return res.status(404).json({ message: "Employer not found or not approved" });
    }

    console.log("✅ Employer validated:", employerUser.email);

    // ✅ Create job entry
    const job = await Job.create({
      title,
      description,
      employer,
      companyName,
      location,
      jobType,
      experienceRequired,
      salary,
      applicationDeadline,
      skillsRequired: Array.isArray(skillsRequired)
        ? skillsRequired
        : skillsRequired.split(",").map(skill => skill.trim()),
      openings: parseInt(openings) || 1,
      status: "Pending"
    });

    console.log("✅ Job created:", job._id);

    res.status(201).json({ message: "Job posted successfully", job });
  } catch (error) {
    console.error("❌ Error in postJob:", error);
    res.status(500).json({ message: error.message });
  }
};



// Admin Approves/Rejects a Job
const reviewJob = async (req, res) => {
  const { jobId, status } = req.body; // Status should be "Approved" or "Rejected"

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    job.status = status;
    await job.save();

    res.json({ message: `Job ${status.toLowerCase()} successfully`, job });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEmployerJobs = async (req, res) => {
  try {
    const employerId = req.employer?.id; // from protect middleware

    if (!employerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const jobs = await Job.find({ employer: employerId }).sort({ createdAt: -1 });

    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching employer jobs:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};

const applyForJob = async (req, res) => {
  const { jobId, studentId } = req.body;
  const resume = req.file ? `/uploads/resumes/${req.file.filename}` : null;

  try {
    console.log("📄 Resume:", resume);
    console.log("👤 Student ID:", studentId);

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // 🧹 Clean malformed applicants if any
    job.applicants = job.applicants?.filter(app => app.student) || [];

    console.log("📋 Cleaned Applicants:", job.applicants);

    const alreadyApplied = job.applicants.find(app =>
      app.student.toString() === studentId
    );

    if (alreadyApplied) {
      return res.status(400).json({ message: "Already applied to this job" });
    }

    // ✅ Push the new valid applicant
    job.applicants.push({
      student: new mongoose.Types.ObjectId(studentId),
      resume
    });

    await job.save();

    res.json({ message: "Application submitted successfully", job });

  } catch (error) {
    console.error("❌ Error applying for job:", error);
    res.status(500).json({ message: error.message });
  }
};


// Get All Job Applications for a Job
const getJobApplicants = async (req, res) => {
  const { jobId } = req.params;

  try {
    const job = await Job.findById(jobId).populate("applicants", "name email evoScore");
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job.applicants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updateApplicationStatus = async (req, res) => {
  const { jobId, studentId, newStatus } = req.body;

  if (!["Accepted", "Rejected", "Pending"].includes(newStatus)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const applicant = job.applicants.find(app => app.student.toString() === studentId);
    if (!applicant) return res.status(404).json({ message: "Student not found in applicants" });

    applicant.status = newStatus;
    await job.save();

    res.json({ message: "Application status updated", applicant });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
};



const registerEmployer = async (req, res) => {
  const {
    type,
    name,
    email,
    password,
    contactNumber,
    industry,
    address,
    companySize,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const employer = await User.create({
      type,
      name,
      email,
      password: hashedPassword,
      role: "Employer",
      contactNumber,
      industry,
      address,
      companySize,
      companyName: name, // Optional: or keep separate
      photo: req.file?.path,
      isApproved: false,
    });

    res.status(201).json({ message: "Employer registered, pending approval", employer });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

  

// Login Employer
const loginEmployer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employer = await User.findOne({ email, role: "Employer" });
    if (!employer) return res.status(404).json({ message: "Employer not found" });

    // Check password
    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Check approval status
    if (!employer.isApproved) return res.status(403).json({ message: "Employer not approved yet" });

    // Generate Token with Role
    const token = jwt.sign(
      { id: employer.id, role: employer.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // ✅ Response with Role Added
    res.json({
      _id: employer.id,
      name: employer.name,
      email: employer.email,
      role: employer.role, // 🔥 Role included in response
      companyName: employer.companyName,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





const getStudentDetailsById = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await User.findById(studentId).select("-password");

    if (!student || student.role !== "Student") {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ student });
  } catch (error) {
    console.error("Error fetching student details:", error);
    res.status(500).json({ message: "Failed to fetch student details" });
  }
};

  

module.exports = { postJob,updateApplicationStatus,getStudentDetailsById, reviewJob, getEmployerJobs, applyForJob, getJobApplicants,registerEmployer, loginEmployer  };
