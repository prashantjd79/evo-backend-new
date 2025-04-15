const express = require("express");
const { postJob, reviewJob,updateApplicationStatus, getEmployerJobs,getStudentDetailsById,applyForJob, getJobApplicants,registerEmployer,loginEmployer } = require("../controllers/jobController");
const { employerProtect } = require("../middleware/authMiddleware");
const { adminProtect } = require("../middleware/authMiddleware");
const { studentProtect } = require("../middleware/authMiddleware");
const uploadEmployerPhoto = require("../middleware/uploadEmployerPhoto");
const uploadResume = require("../middleware/uploadResume");
const router = express.Router();

router.post("/", employerProtect, postJob); // Employer posts a job
router.put("/review", adminProtect, reviewJob); // Admin approves/rejects a job
router.get("/my-jobs", employerProtect, getEmployerJobs); // Get all jobs (optional filter by status)
router.post("/apply",studentProtect, uploadResume.single("resume"), applyForJob); // Student applies for a job
router.get("/:jobId/applicants", employerProtect, getJobApplicants); // Get job applicants
router.post("/signup", uploadEmployerPhoto.single("photo"), registerEmployer);
router.post("/login", loginEmployer);
router.get("/student/:id", employerProtect, getStudentDetailsById);
router.put("/update-status", employerProtect, updateApplicationStatus);

module.exports = router;
