const Job = require("../models/Job");
const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");






// Employer Posts a Job
const postJob = async (req, res) => {
  const { title, description, employerId } = req.body;

  try {
    const job = await Job.create({
      title,
      description,
      employer: employerId,
      status: "Pending"
    });

    res.status(201).json({ message: "Job posted successfully and pending approval", job });
  } catch (error) {
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

// Get All Jobs (Filtered by Status)
const getAllJobs = async (req, res) => {
  const { status } = req.query; // Optional status filter

  try {
    let query = {};
    if (status) query.status = status;

    const jobs = await Job.find(query).populate("employer", "name email");
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Students Apply for a Job
const applyForJob = async (req, res) => {
  const { jobId, studentId } = req.body;

  try {
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (!job.applicants.includes(studentId)) {
      job.applicants.push(studentId);
      await job.save();
    }

    res.json({ message: "Application submitted successfully", job });
  } catch (error) {
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





const registerEmployer = async (req, res) => {
    const { name, email, password, companyName } = req.body;
  
    try {
      // Check if email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: "Email already in use" });
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create employer user (without wannaBeInterest)
      const employer = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "Employer",
        companyName,
        isApproved: false, // Requires Admin Approval
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




  

module.exports = { postJob, reviewJob, getAllJobs, applyForJob, getJobApplicants,registerEmployer, loginEmployer  };
