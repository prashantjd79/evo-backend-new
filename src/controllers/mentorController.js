const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SubmittedAssignment = require("../models/SubmittedAssignment");
const { updateEvoScore } = require("../utils/evoScoreUtils");
const Review = require("../models/Review");
const Blog = require("../models/Blog");
const Ticket = require("../models/Ticket");


// const registerMentor = async (req, res) => {
//   const { name, email, password, expertise } = req.body;

//   try {
//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "Email already in use" });

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create mentor user
//     const mentor = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "Mentor",
//       expertise,
//       isApproved: false, // Requires Admin Approval
//     });

//     res.status(201).json({ message: "Mentor registered, pending approval", mentor });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const registerMentor = async (req, res) => {
  const {
    name,
    username,
    dob,
    email,
    password,
    contactNumber,
    bio,
    address,
    education,
    expertise,
    workingMode
  } = req.body;

  try {
    // Check email and username
    const existingEmail = await User.findOne({ email });
    if (existingEmail) return res.status(400).json({ message: "Email already in use" });

    const existingUsername = await User.findOne({ username });
    if (existingUsername) return res.status(400).json({ message: "Username already taken" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const photo = req.file ? `mentors/${req.file.filename}` : null;

    const mentor = await User.create({
      name,
      username,
      dob,
      email,
      password: hashedPassword,
      contactNumber,
      photo,
      bio,
      address,
      education,
      expertise,
      workingMode,
      role: "Mentor",
      isApproved: false // pending admin approval
    });

    res.status(201).json({
      message: "Mentor registered, pending approval",
      mentor: {
        _id: mentor._id,
        name: mentor.name,
        username: mentor.username,
        email: mentor.email,
        expertise: mentor.expertise,
        photo: mentor.photo,
        isApproved: mentor.isApproved,
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const loginMentor = async (req, res) => {
  const { email, password } = req.body;

  try {
    const mentor = await User.findOne({ email, role: "Mentor" });
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    if (mentor.banned) {
      return res.status(403).json({ message: "Your account has been banned by the admin." });
    }
    

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
    const assignments = await SubmittedAssignment.find().populate("student", "name email").populate("lesson","course")
     // Change "student" to "user" if required
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

    
    // ✅ Score is directly out of 10
    assignment.score = score;
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


// const gradeAssignment = async (req, res) => {
//   const { assignmentId, score, feedback } = req.body;

//   try {
//     // ✅ Fetch the assignment and populate lesson details
//     const assignment = await SubmittedAssignment.findById(assignmentId).populate("lesson");

//     if (!assignment) return res.status(404).json({ message: "Assignment not found" });

//     console.log("Assignment Data Before Grading:", assignment);

//     // ✅ Ensure assignment has a courseId
//     if (!assignment.course && assignment.lesson?.course) {
//       assignment.course = assignment.lesson.course;
//       await assignment.save();
//       console.log("✅ Updated Assignment with CourseId:", assignment);
//     }

//     if (!assignment.course) {
//       console.error("❌ Error: Assignment does not have a courseId!");
//       return res.status(500).json({ message: "Assignment does not have a valid courseId." });
//     }

//     // ✅ Directly save score (already out of 10)
//     assignment.score = score;
//     assignment.feedback = feedback;
//     await assignment.save();

//     console.log("✅ Assignment Graded Successfully:", assignment);

//     // ✅ Update Evo Score
//     await updateEvoScore(assignment.student, assignment.course);

//     res.json({
//       message: "Assignment graded successfully. Evo Score updated.",
//       assignment
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const getMyProfileByRole = async (req, res) => {
  try {
    const id = req.user?.id || req.mentor?.id || req.student?.id || req.employer?.id || req.courseCreator?.id || req.publisher?.id || req.manager?.id;

    if (!id) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};




const getReviewsByCourseId = async (req, res) => {
  try {
    const { courseId } = req.params;

    const reviews = await Review.find({ course: courseId })
      .populate("user", "name photo") // ✅ Correct reference
      .sort({ createdAt: -1 });

    res.status(200).json({ reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};

const getApprovedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: "Approved" })
      .sort({ createdAt: -1 })
      .populate( "title");

    res.status(200).json({ blogs });
  } catch (error) {
    console.error("Error fetching approved blogs:", error);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};




module.exports = { registerMentor,getApprovedBlogs, loginMentor,getSubmittedAssignments,gradeAssignment, getMyProfileByRole,getReviewsByCourseId
  };
