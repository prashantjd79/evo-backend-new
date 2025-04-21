const Job = require("../models/Job");
const User = require("../models/User");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const EvoScore = require("../models/EvoScore");





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

const updateEmployerProfile = async (req, res) => {
  try {
    const employerId = req.employer?._id;

    if (!employerId) {
      return res.status(401).json({ message: "Unauthorized: Employer not found" });
    }

    const updates = {
      type: req.body.type,
      name: req.body.name,
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      industry: req.body.industry,
      address: req.body.address,
      companySize: req.body.companySize,
    };

    // ✅ Handle profile photo upload
    if (req.file) {
      updates.photo = `employers/${req.file.filename}`;
    } else if (req.body.photo) {
      updates.photo = req.body.photo;
    }

    const updatedEmployer = await User.findByIdAndUpdate(employerId, updates, {
      new: true,
    }).select("-password");

    if (!updatedEmployer) {
      return res.status(404).json({ message: "Employer not found" });
    }

    res.status(200).json({
      message: "Employer profile updated successfully",
      employer: updatedEmployer,
    });
  } catch (error) {
    console.error("❌ Error updating employer profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Login Employer
const loginEmployer = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employer = await User.findOne({ email, role: "Employer" });
    if (!employer) return res.status(404).json({ message: "Employer not found" });

    if (employer.banned) {
      return res.status(403).json({ message: "Your account has been banned by the admin." });
    }
    

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

const getStudentById = async (req, res) => {
  try {
    const studentId = req.params.id;
    console.log("🔍 Fetching student by ID:", studentId);

    // Fetch student
    const student = await User.findOne({ _id: studentId, role: "Student" }).lean();
    if (!student) {
      console.log("❌ Student not found in User collection");
      return res.status(404).json({ message: "Student not found" });
    }
    console.log("✅ Student found:", student.name);

    // Fetch evoscore entry
    const evoScoreEntry = await EvoScore.findOne({ student: studentId }).lean();
    if (!evoScoreEntry) {
      console.log("⚠️ No EvoScore entry found for student.");
    } else {
      console.log("📊 EvoScore data:", evoScoreEntry);
    }

    // Extract values using correct casing
    const evoscore = evoScoreEntry?.evoScore || 0;
    const assignmentScore = evoScoreEntry?.assignmentScore || 0;
    const quizScore = evoScoreEntry?.quizScore || 0;

    // Construct clean response object
    const responsePayload = {
      _id: student._id,
      name: student.name,
      email: student.email,
      evoscore,
      assignmentScore,
      quizScore,
      testKey: "I am visible in Postman ✅"
    };

    console.log("📤 Response sent to Postman:", responsePayload);

    // Ensure proper headers and response
    res.setHeader("Content-Type", "application/json");
    res.status(200).json(responsePayload);
  } catch (error) {
    console.error("❌ Error in getStudentById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const updateJobByEmployer = async (req, res) => {
  try {
    const jobId = req.params.id;
    const employerId = req.employer._id; // from employerProtect middleware

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employer.toString() !== employerId.toString()) {
      return res.status(403).json({ message: "Unauthorized: You do not own this job" });
    }

    const updatedFields = {
      title: req.body.title,
      description: req.body.description,
      companyName: req.body.companyName,
      location: req.body.location,
      jobType: req.body.jobType,
      experienceRequired: req.body.experienceRequired,
      salary: req.body.salary,
      applicationDeadline: req.body.applicationDeadline,
      openings: req.body.openings,
      skillsRequired: Array.isArray(req.body.skillsRequired)
        ? req.body.skillsRequired
        : req.body.skillsRequired?.split(",").map(skill => skill.trim()),
    };

    const updatedJob = await Job.findByIdAndUpdate(jobId, updatedFields, { new: true });

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("❌ Error updating job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteJobByEmployer = async (req, res) => {
  try {
    const jobId = req.params.id;
    const employerId = req.employer._id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employer.toString() !== employerId.toString()) {
      return res.status(403).json({ message: "Unauthorized: You do not own this job" });
    }

    await Job.findByIdAndDelete(jobId);

    res.status(200).json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting job:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { postJob,updateEmployerProfile,updateApplicationStatus,updateJobByEmployer,deleteJobByEmployer,getStudentById, reviewJob, getEmployerJobs, applyForJob, getJobApplicants,registerEmployer, loginEmployer  };
