const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const PromoCode = require("../models/PromoCode");
const Transaction = require("../models/Transaction");
const SubmittedAssignment = require("../models/SubmittedAssignment");
const SubmittedQuiz = require("../models/SubmittedQuiz");
const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const Path = require("../models/Path");
const EvoScore = require("../models/EvoScore");
const { updateEvoScore } = require("../utils/evoScoreUtils"); // ✅ Correct
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs");
const generateOtp = require("../utils/generateOtp");
const { sendOtpEmail } = require("../utils/email");
const Otp = require("../models/Otp");
const Certificate = require("../models/Certificate");
const Batch = require("../models/Batch");
const Job = require("../models/Job");



// Generate JWT Token
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};
const signupStudent = async (req, res) => {
  const {
    name, dob, email, password, contactNumber, guardianName,
    address, education, preferredLanguages, wannaBeInterest, experience,
  } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use" });

    const otp = generateOtp();

    await Otp.create({
      email,
      otp,
      data: {
        name, dob, email, password, contactNumber, guardianName,
        address, education, preferredLanguages, wannaBeInterest, experience,
        photo: req.file ? `students/${req.file.filename}` : null,
      },
    });

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent to email for verification." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    const student = await User.findOne({ email, role: "Student" });
    if (!student) return res.status(404).json({ message: "Student not found" });

    if (!student.isVerified) {
      return res.status(403).json({ message: "Email not verified. Please verify first." });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      role: student.role,
      wannaBeInterest: student.wannaBeInterest,
      token: generateToken(student._id, student.role),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getApprovedJobsForStudents = async (req, res) => {
  try {
    const jobs = await Job.find({ status: "Approved" });

    res.json({ jobs });
  } catch (error) {
    console.error("Error fetching approved jobs:", error);
    res.status(500).json({ message: "Failed to fetch jobs" });
  }
};



const enrollInCourse = async (req, res) => {
  const { courseId } = req.body; // ✅ No studentId in request body

  try {
    // ✅ Ensure student is authenticated from token
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: No student ID found in token" });
    }

    // ✅ Fetch the authenticated student
    const student = await User.findById(req.user._id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // ✅ Validate course existence
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    // ✅ Check if student is already enrolled
    const alreadyEnrolled = student.enrolledCourses.some(enrolled => 
      enrolled.course.toString() === courseId
    );
    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // ✅ Enroll the student
    student.enrolledCourses.push({ course: courseId });
    await student.save();

    res.json({ message: "Successfully enrolled in the course", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const enrollInPath = async (req, res) => {
  const { pathId } = req.body; // ✅ No studentId in request body

  try {
    // ✅ Ensure student is authenticated from token
    if (!req.student || !req.student.id) {
      return res.status(401).json({ message: "Unauthorized: No student ID found in token" });
    }

    // ✅ Fetch the authenticated student
    const student = await User.findById(req.student.id);
    if (!student) return res.status(404).json({ message: "Student not found" });

    // ✅ Validate path existence
    const path = await Path.findById(pathId);
    if (!path) return res.status(404).json({ message: "Path not found" });

    // ✅ Check if student is already enrolled in the path
    const alreadyEnrolled = student.enrolledCourses.some(enrolled => 
      enrolled.course.toString() === pathId
    );
    if (alreadyEnrolled) {
      return res.status(400).json({ message: "Already enrolled in this path" });
    }

    // ✅ Enroll the student in the path
    student.enrolledCourses.push({ course: pathId });
    await student.save();

    res.json({ message: "Successfully enrolled in the path", student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getEnrolledCourses = async (req, res) => {
  try {
    // ✅ Ensure student is authenticated from token
    if (!req.student || !req.student.id) {
      return res.status(401).json({ message: "Unauthorized: No student ID found in token" });
    }

    // ✅ Fetch the authenticated student and populate courses
    const student = await User.findById(req.student.id)
      .populate("enrolledCourses.course", "name description") // Populate Course details
      .select("name email enrolledCourses");

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getEnrolledPaths = async (req, res) => {
  try {
    // ✅ Ensure student is authenticated from token
    if (!req.student || !req.student.id) {
      return res.status(401).json({ message: "Unauthorized: No student ID found in token" });
    }

    // ✅ Fetch the authenticated student and populate paths
    const student = await User.findById(req.student.id)
      .populate("enrolledCourses.course", "name description") // Assuming paths are also stored here
      .select("name email enrolledCourses");

    if (!student) return res.status(404).json({ message: "Student not found" });

    res.json({ student });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};







// // Student Registration
// const registerStudent = async (req, res) => {
//   const { name, email, password, wannaBeInterest } = req.body;

//   try {
//     // Check if email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "Email already in use" });

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create student user
//     const student = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: "Student",
//       wannaBeInterest,
//     });

//     res.status(201).json({
//       _id: student.id,
//       name: student.name,
//       email: student.email,
//       wannaBeInterest: student.wannaBeInterest,
//       token: generateToken(student.id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };





const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired OTP." });
    }

    const { data } = otpRecord;

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const student = await User.create({
      ...data,
      password: hashedPassword,
      role: "Student",
      isVerified: true, // verified now
    });

    await Otp.deleteOne({ email, otp });

    res.status(201).json({
      _id: student._id,
      name: student.name,
      email: student.email,
      message: "Email verified successfully. You can now login.",
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// const loginStudent = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const student = await User.findOne({ email, role: "Student" });
//     if (!student) return res.status(404).json({ message: "Student not found" });

//     // Check password
//     const isMatch = await bcrypt.compare(password, student.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

//     // Generate Token with Role
//     res.json({
//       _id: student.id,
//       name: student.name,
//       email: student.email,
//       role: student.role, // ✅ Add role to response
//       wannaBeInterest: student.wannaBeInterest,
//       token: generateToken(student.id, student.role), // ✅ Token includes role
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// Get Student Profile
const getStudentProfile = async (req, res) => {
  try {
    // ✅ Fetch EvoScore separately
    const evoScoreData = await EvoScore.findOne({ student: req.user._id }).select("evoScore");

    if (!evoScoreData) {
      return res.status(404).json({ message: "EvoScore not found" });
    }

    res.json({ evoScore: evoScoreData.evoScore });
  } catch (error) {
    console.error("❌ Error fetching student profile:", error.message);
    res.status(500).json({ message: error.message });
  }
};

// Apply Promo Code (Validate & Get Discount)
const applyPromoCode = async (req, res) => {
  const { code, courseId, pathId } = req.body;

  try {
    const promoCode = await PromoCode.findOne({ code, isActive: true });

    if (!promoCode) return res.status(400).json({ message: "Invalid or expired promo code" });

    // Ensure the promo code applies to the correct Course or Path
    if ((promoCode.course && promoCode.course.toString() !== courseId) ||
        (promoCode.path && promoCode.path.toString() !== pathId)) {
      return res.status(400).json({ message: "Promo code is not valid for the selected item" });
    }

    res.json({ 
      message: "Promo code applied successfully", 
      discountPercentage: promoCode.discountPercentage 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Apply Promo Code and Save Transaction
const applyPromoCodeAndPurchase = async (req, res) => {
  const { code, courseId, pathId, userId, originalAmount, paymentMethod } = req.body;

  try {
    const promoCode = await PromoCode.findOne({ code, isActive: true });

    if (!promoCode) return res.status(400).json({ message: "Invalid or expired promo code" });

    // Ensure the promo code applies to the correct Course or Path
    if ((promoCode.course && promoCode.course.toString() !== courseId) ||
        (promoCode.path && promoCode.path.toString() !== pathId)) {
      return res.status(400).json({ message: "Promo code is not valid for the selected item" });
    }

    // Calculate discounted amount
    const discountAmount = (originalAmount * promoCode.discountPercentage) / 100;
    const finalAmount = originalAmount - discountAmount;

    // Save transaction with applied promo code
    const transaction = await Transaction.create({
      user: userId,
      course: courseId || null,
      path: pathId || null,
      originalAmount,
      amount: finalAmount,
      discountApplied: promoCode.discountPercentage,
      promoCode: code,
      paymentMethod,
      status: "Completed"
    });

    res.json({
      message: "Promo code applied successfully and transaction saved",
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






// const submitAssignment = async (req, res) => {
//   const { lessonId, fileUrl } = req.body;
//   const studentId = req.user._id;

//   try {
//     // ✅ Validate lesson
//     const lesson = await Lesson.findById(lessonId);
//     if (!lesson) return res.status(404).json({ message: "Lesson not found" });

//     console.log("Lesson Data:", lesson); // 🔹 Debugging log

//     // ✅ Ensure lesson has a courseId
//     if (!lesson.course) {
//       console.error("Error: Lesson does not have a courseId!");
//       return res.status(500).json({ message: "Lesson does not have a valid courseId." });
//     }

//     // ✅ Check if student already submitted an assignment for this lesson
//     const existingSubmission = await SubmittedAssignment.findOne({
//       student: studentId,
//       lesson: lessonId
//     });

//     if (existingSubmission) {
//       return res.status(400).json({ message: "You have already submitted an assignment for this lesson." });
//     }

//     // ✅ Save assignment submission with `courseId`
//     const submission = await SubmittedAssignment.create({
//       student: studentId,
//       lesson: lessonId,
//       course: lesson.course,  // ✅ Now `courseId` is explicitly stored
//       fileUrl
//     });

//     console.log("Assignment Submitted Successfully:", submission); // 🔹 Debugging log

//     res.status(201).json({ 
//       message: "Assignment submitted successfully. Awaiting grading.", 
//       submission 
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const submitAssignment = async (req, res) => {
  const { lessonId, description } = req.body;
  const studentId = req.user._id;

  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (!lesson.course) {
      return res.status(500).json({ message: "Lesson does not have a valid courseId." });
    }

    const existing = await SubmittedAssignment.findOne({ student: studentId, lesson: lessonId });

    if (existing) {
      const filePath = path.join("uploads", "submitted", req.file.filename);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath); // Remove duplicate file
      return res.status(400).json({ message: "You already submitted this assignment." });
    }

    const submission = await SubmittedAssignment.create({
      _id: new mongoose.Types.ObjectId(),
      student: studentId,
      lesson: lessonId,
      course: lesson.course,
      fileUrl: `submitted/${req.file.filename}`,
      description: description || "",
    });

    res.status(201).json({
      message: "Assignment submitted successfully.",
      submission: {
        _id: submission._id,
        fileUrl: submission.fileUrl,
        description: submission.description,
        lessonId: submission.lesson,
        studentId: submission.student,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const submitQuiz = async (req, res) => {
  const { lessonId, answers } = req.body;
  const studentId = req.user._id;

  try {
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ message: "Lesson not found" });

    // ✅ Store correct answers in a map
    const correctAnswers = lesson.quizzes.reduce((acc, quiz) => {
      acc[quiz.question] = quiz.correctAnswer;
      return acc;
    }, {});

    let correctCount = 0;
    const gradedAnswers = answers.map(answer => {
      const correctAnswer = correctAnswers[answer.question] || "N/A";
      const isCorrect = answer.selectedAnswer === correctAnswer;
      if (isCorrect) correctCount++;
      return { ...answer, correctAnswer, isCorrect };
    });

    // ✅ Convert score to be out of 10
    const totalQuestions = lesson.quizzes.length;
    const maxScore = 10; // Out of 10
    let quizScore = totalQuestions > 0 ? (correctCount / totalQuestions) * maxScore : 0;

    // ✅ Round the score properly
    quizScore = Math.round(quizScore * 10) / 10; // Keeps one decimal place

    // ✅ Ensure a student can only submit once
    const existingSubmission = await SubmittedQuiz.findOne({ student: studentId, lesson: lessonId });
    if (existingSubmission) {
      return res.status(400).json({ message: "Quiz already submitted for this lesson." });
    }

    await SubmittedQuiz.create({ 
      student: studentId, 
      lesson: lessonId, 
      course: lesson.course, 
      answers: gradedAnswers, 
      score: quizScore 
    });

    // ✅ Ensure Evo Score Updates After Submission
    await updateEvoScore(studentId, lesson.course);

    res.status(201).json({ 
      message: "Quiz submitted successfully. Awaiting assignment grading.",
      quizScore
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





const getMyCertificates = async (req, res) => {
  try {
    const studentId = req.user._id; // From auth middleware

    const certificates = await Certificate.find({ student: studentId })
      .populate("course", "title")
      .sort({ issueDate: -1 });

    res.json({ certificates });
  } catch (error) {
    console.error("Error fetching student certificates:", error);
    res.status(500).json({ message: "Failed to fetch certificates" });
  }
};


const getAllCoursesForStudents = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("category", "title")
      .populate("subcategory", "title")
      .populate("wannaBeInterest", "title")
      .select("title photo realPrice discountedPrice tags category subcategory wannaBeInterest");

    res.json({ courses });
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};


const getMyEnrolledCourses = async (req, res) => {
  try {
    const student = await User.findById(req.user._id)
      .populate({
        path: "enrolledCourses.course",
        select: "title photo realPrice discountedPrice category subcategory wannaBeInterest"
      })
      .populate("enrolledCourses.course.category", "title")
      .populate("enrolledCourses.course.subcategory", "title")
      .populate("enrolledCourses.course.wannaBeInterest", "title")
      .select("enrolledCourses");

    res.json({ enrolledCourses: student.enrolledCourses });
  } catch (error) {
    console.error("Error fetching enrolled courses:", error);
    res.status(500).json({ message: "Failed to fetch enrolled courses" });
  }
};

const getBatchById = async (req, res) => {
  const { batchId } = req.params;

  try {
    const batch = await Batch.findById(batchId)
      .populate("course", "title")
      .populate({ path: "mentor", model: "User", select: "name email" })
      .populate({ path: "students", model: "User", select: "name email photo" });

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.json({ batch });
  } catch (error) {
    console.error("Error fetching batch:", error);
    res.status(500).json({ message: "Failed to fetch batch" });
  }
};

const getLessonsByCourseForStudent = async (req, res) => {
  const { courseId } = req.params;
  const studentId = req.user._id;

  try {
    // Check if student is enrolled
    const student = await User.findById(studentId);
    const isEnrolled = student.enrolledCourses.some(
      (item) => item.course.toString() === courseId
    );

    if (!isEnrolled) {
      return res.status(403).json({ message: "You are not enrolled in this course." });
    }

    // Fetch lessons
    const lessons = await Lesson.find({ course: courseId }).select(
      "title content videoUrl resources"
    );

    res.json({ lessons });
  } catch (error) {
    console.error("Error fetching lessons:", error);
    res.status(500).json({ message: "Failed to fetch lessons" });
  }
};
const getMyBatches = async (req, res) => {
  const studentId = req.user._id;

  try {
    const batches = await Batch.find({ students: studentId })
      .populate("course", "title")
      .populate({ path: "mentor", model: "User", select: "name email" })
      .select("course mentor batchWeekType time description");

    res.json({ batches });
  } catch (error) {
    console.error("Error fetching student batches:", error);
    res.status(500).json({ message: "Failed to fetch your batches" });
  }
};

module.exports = { signupStudent,getApprovedJobsForStudents,getBatchById,getMyBatches,getLessonsByCourseForStudent,getMyEnrolledCourses,getAllCoursesForStudents,verifyOtp,getMyCertificates, getEnrolledPaths,loginStudent, getStudentProfile,applyPromoCode ,applyPromoCodeAndPurchase,submitAssignment,submitQuiz, enrollInCourse, enrollInPath, getEnrolledCourses};
