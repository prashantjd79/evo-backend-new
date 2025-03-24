const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SubmittedAssignment = require("../models/SubmittedAssignment");
const { updateEvoScore } = require("../utils/evoScoreUtils");




// Register Mentor
const registerMentor = async (req, res) => {
  const { name, email, password, expertise } = req.body;

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create mentor user
    const mentor = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "Mentor",
      expertise,
      isApproved: false, // Requires Admin Approval
    });

    res.status(201).json({ message: "Mentor registered, pending approval", mentor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginMentor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const mentor = await User.findOne({ email, role: "Mentor" });
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    // Check password
    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    // Check approval status
    if (!mentor.isApproved) return res.status(403).json({ message: "Mentor not approved yet" });

    // Generate Token with Role
    const token = jwt.sign(
      { id: mentor.id, role: mentor.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    // ✅ Response with Role Added
    res.json({
      _id: mentor.id,
      name: mentor.name,
      email: mentor.email,
      role: mentor.role, // 🔥 Role included in response
      expertise: mentor.expertise,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubmittedAssignments = async (req, res) => {
  try {
    const assignments = await SubmittedAssignment.find().populate("student", "name email"); // Change "student" to "user" if required
    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const gradeAssignment = async (req, res) => {
  const { assignmentId, score, feedback } = req.body;

  try {
    // ✅ Fetch the assignment and populate lesson details
    const assignment = await SubmittedAssignment.findById(assignmentId).populate("lesson");

    if (!assignment) return res.status(404).json({ message: "Assignment not found" });

    console.log("Assignment Data Before Grading:", assignment); // 🔹 Debugging log

    // ✅ If `assignment.course` is missing, fetch it from `lesson.course`
    if (!assignment.course && assignment.lesson && assignment.lesson.course) {
      assignment.course = assignment.lesson.course;
      await assignment.save();  // ✅ Save the updated assignment
      console.log("Updated Assignment with CourseId:", assignment);
    }

    if (!assignment.course) {
      console.error("Error: Assignment does not have a courseId!");
      return res.status(500).json({ message: "Assignment does not have a valid courseId." });
    }

    // ✅ Normalize score to be out of 10
    const normalizedScore = (score / 100) * 10;
    assignment.score = normalizedScore;
    assignment.feedback = feedback;
    await assignment.save();

    console.log("Assignment Graded Successfully:", assignment); // 🔹 Debugging log

    // ✅ Ensure Evo Score Updates After Mentor Grades Assignment
    await updateEvoScore(assignment.student, assignment.course);

    res.json({ 
      message: "Assignment graded successfully. Evo Score updated.", 
      assignment 
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};









module.exports = { registerMentor, loginMentor,getSubmittedAssignments,gradeAssignment };
