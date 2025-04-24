const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Blog = require("../models/Blog");
const SubmittedAssignment = require("../models/SubmittedAssignment");   
const Transaction = require("../models/Transaction");
const { Parser } = require("json2csv"); // For CSV export
const fs = require("fs");
const Certificate = require("../models/Certificate");
const Batch = require("../models/Batch");
const Job = require("../models/Job");
const Course = require("../models/Course");
const WannaBeInterest = require("../models/WannaBeInterest");
const Subcategory = require("../models/Subcategory");
const Category = require("../models/Category");
const path = require("path");
const Review = require("../models/Review");
const Lesson = require("../models/Lesson");
const PromoCode = require("../models/PromoCode");
const Ticket=require("../models/Ticket");
const Announcement=require("../models/Announcement");

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    await course.deleteOne();
    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting course:", error);
    res.status(500).json({ message: "Failed to delete course" });
  }
};

const deletePromoCode = async (req, res) => {
  try {
    const { id } = req.params;
    const promo = await PromoCode.findById(id);
    if (!promo) return res.status(404).json({ message: "Promo Code not found" });

    await promo.deleteOne();
    res.status(200).json({ message: "Promo Code deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting promo code:", error);
    res.status(500).json({ message: "Failed to delete promo code" });
  }
};


const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    await ticket.deleteOne();
    res.status(200).json({ message: "Ticket deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting ticket:", error);
    res.status(500).json({ message: "Failed to delete ticket" });
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const { id } = req.params;
    const announcement = await Announcement.findById(id);
    if (!announcement) return res.status(404).json({ message: "Announcement not found" });

    await announcement.deleteOne();
    res.status(200).json({ message: "Announcement deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting announcement:", error);
    res.status(500).json({ message: "Failed to delete announcement" });
  }
};


const deleteBatch = async (req, res) => {
  try {
    const { id } = req.params;
    const batch = await Batch.findById(id);
    if (!batch) return res.status(404).json({ message: "Batch not found" });

    await batch.deleteOne();
    res.status(200).json({ message: "Batch deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting batch:", error);
    res.status(500).json({ message: "Failed to delete batch" });
  }
};


const getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find()
      .populate("user", "name email")          // optional: shows user info
      .populate("course", "title realPrice")   // optional: shows course info
      .sort({ createdAt: -1 });                // latest first

    res.status(200).json({
      message: "All transactions fetched successfully",
      transactions,
    });
  } catch (error) {
    console.error("❌ Error fetching all transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const exportTransactionsCSV = async (req, res) => {
  const { courseId } = req.query;

  try {
    let filter = {};
    if (courseId) filter.course = courseId;

    const transactions = await Transaction.find(filter)
      .populate("user", "name email")
      .populate("course", "title")
      .populate("path", "title");

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found for the given course." });
    }

    const fields = ["User", "Email", "Course", "Path", "Amount", "Payment Method", "Status", "Transaction Date"];
    const data = transactions.map(txn => ({
      User: txn.user?.name || "N/A",
      Email: txn.user?.email || "N/A",
      Course: txn.course?.title || "N/A",
      Path: txn.path?.title || "N/A",
      Amount: txn.amount,
      "Payment Method": txn.paymentMethod,
      Status: txn.status,
      "Transaction Date": txn.transactionDate.toISOString()
    }));

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    // Ensure the 'exports' directory exists
    const exportsDir = path.join(__dirname, "../../exports");
    if (!fs.existsSync(exportsDir)) {
      fs.mkdirSync(exportsDir);
    }

    const filePath = path.join(exportsDir, `transactions_${Date.now()}.csv`);
    fs.writeFileSync(filePath, csv);

    res.download(filePath, "transactions.csv", () => {
      fs.unlinkSync(filePath); // Clean up
    });
  } catch (error) {
    console.error("CSV Export Error:", error);
    res.status(500).json({ message: error.message });
  }
};







// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Admin Registration (First Time Only)
const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const adminExists = await Admin.findOne({ email });
    if (adminExists) return res.status(400).json({ message: "Admin already exists" });

    const admin = await Admin.create({ name, email, password });
    if (admin) {
      res.status(201).json({
        _id: admin.id,
        name: admin.name,
        email: admin.email,
        message: "Admin registered successfully. Please log in.",
      });
    } else {
      res.status(400).json({ message: "Invalid admin data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (admin && (await bcrypt.compare(password, admin.password))) {
      res.json({
        _id: admin.id,
        name: admin.name,
        email: admin.email,
        role: "Admin", // ✅ Ensure role is included
        token: jwt.sign({ id: admin.id, role: "Admin" }, process.env.JWT_SECRET, { expiresIn: "30d" }),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// Approve/Disapprove User
const approveUser = async (req, res) => {
  const { userId, status } = req.body; // status should be 'approve' or 'disapprove'

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isApproved = status === "approve";
    await user.save();

    res.json({ message: `User ${status}d successfully`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Pending Approvals
const getPendingApprovals = async (req, res) => {
  try {
    const users = await User.find({ isApproved: false });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Approval for Mentor
const approveMentor = async (req, res) => {
  const { mentorId, status } = req.body; // status should be 'approve' or 'disapprove'

  try {
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    mentor.isApproved = status === "approve";
    await mentor.save();

    res.json({ message: `Mentor ${status}d successfully`, mentor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// Get All Pending Mentor Approvals
const getPendingMentors = async (req, res) => {
  try {
    const mentors = await Mentor.find({ isApproved: false });
    res.json(mentors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Get Profile of a Specific User
const getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Users by Role
const getUsersByRole = async (req, res) => {
  const { role } = req.params; // Example: role = "Mentor", "Student", etc.

  try {
    const users = await User.find({ role }).select("-password"); // Exclude password for security
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPlatformAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({});
    const managers = await User.countDocuments({ role: "Manager" });
    const mentors = await User.countDocuments({ role: "Mentor" });
    const students = await User.countDocuments({ role: "Student" });
    const courseCreators = await User.countDocuments({ role: "Course Creator" });
    const employers = await User.countDocuments({ role: "Employer" });

    console.log({ totalUsers, managers, mentors, students, courseCreators, employers });

    res.json({
      totalUsers,
      managers,
      mentors,
      students,
      courseCreators,
      employers
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Update User Status (Active/Inactive/Banned)
const updateUserStatus = async (req, res) => {
  const { userId, status } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.status = status;
    await user.save();

    res.json({ message: `User status updated to ${status}`, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().populate("creator", "name email"); // Fetch publisher details

    res.json({ message: "All blogs fetched successfully", blogs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const approveOrRejectBlog = async (req, res) => {
  try {
    const { status } = req.body; // Expecting "Approved" or "Rejected"

    // Check if blog exists
    const blog = await Blog.findById(req.params.blogId);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Validate the status value
    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use 'Approved' or 'Rejected'." });
    }

    // Update blog status
    blog.status = status;
    await blog.save();

    res.json({ message: `Blog ${status.toLowerCase()} successfully`, blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const assignMentorsToManager = async (req, res) => {
  const { managerId, mentorIds } = req.body; // Expecting an array of mentor IDs

  try {
    const manager = await User.findById(managerId);
    if (!manager || manager.role !== "Manager") {
      return res.status(404).json({ message: "Manager not found" });
    }

    // Validate mentor existence
    const mentors = await User.find({ _id: { $in: mentorIds }, role: "Mentor" });
    if (mentors.length !== mentorIds.length) {
      return res.status(400).json({ message: "One or more mentors not found" });
    }

    // Assign mentors to the manager
    manager.assignedMentors = mentorIds;
    await manager.save();

    res.json({ message: "Mentors assigned successfully", manager });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateAssignedMentorsToManager = async (req, res) => {
  const { managerId, mentorIds } = req.body; // Expecting an array of mentor IDs

  try {
    const manager = await User.findById(managerId);
    if (!manager || manager.role !== "Manager") {
      return res.status(404).json({ message: "Manager not found" });
    }

    // Validate mentor existence
    const mentors = await User.find({ _id: { $in: mentorIds }, role: "Mentor" });
    if (mentors.length !== mentorIds.length) {
      return res.status(400).json({ message: "One or more mentors not found or not valid mentors" });
    }

    // Update the mentor assignment
    manager.assignedMentors = mentorIds;
    await manager.save();

    res.json({ message: "Assigned mentors updated successfully", manager });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getAllSubmittedAssignments = async (req, res) => {
  try {
    const submissions = await SubmittedAssignment.find()
      .populate("student", "name email")
      .populate("course", "title")
      .populate("lesson", "title")
      .sort({ submittedAt: -1 });

    res.json({ submissions });
  } catch (error) {
    console.error("Error fetching submitted assignments:", error);
    res.status(500).json({ message: "Failed to fetch submitted assignments" });
  }
};

const getAllCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find()
      .populate("student", "name email")
      .populate("course", "title")
      .sort({ issueDate: -1 });

    res.json({ certificates });
  } catch (error) {
    console.error("Error fetching certificates:", error);
    res.status(500).json({ message: "Failed to fetch certificates" });
  }
};


const getBatchesByCourseId = async (req, res) => {
  const { courseId } = req.params;

  try {
    const batches = await Batch.find({ course: courseId })
      .populate({ path: "mentor", model: "User", select: "name email" })
      .populate({ path: "students", model: "User", select: "name email" })
      .populate("course", "title");

    res.json({ batches });
  } catch (error) {
    console.error("Error fetching batches:", error);
    res.status(500).json({ message: "Failed to fetch batches for the course" });
  }
};
const getAllBatches = async (req, res) => {
  try {
    const batches = await Batch.find()
      .populate({ path: "mentor", model: "User", select: "name email" })
      .populate({ path: "students", model: "User", select: "name email" })
      .populate("course", "title");

    res.json({ batches });
  } catch (error) {
    console.error("Error fetching all batches:", error);
    res.status(500).json({ message: "Failed to fetch all batches" });
  }
};

const getStudentsByCourseId = async (req, res) => {
  const { courseId } = req.params;

  try {
    const students = await User.find({
      role: "Student",
      "enrolledCourses.course": courseId
    }).select("name email enrolledCourses");

    res.json({ students });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ message: "Failed to fetch students for this course" });
  }
};
const getAllCourseCreators = async (req, res) => {
  try {
    const creators = await User.find({ role: "Course Creator" })
      .select("name email isApproved status createdAt");

    res.json({ creators });
  } catch (error) {
    console.error("Error fetching course creators:", error);
    res.status(500).json({ message: "Failed to fetch course creators" });
  }
};

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("employer", "name email companyName")
      .sort({ createdAt: -1 });

    res.json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Failed to fetch job listings" });
  }
};
const getCoursesWithDetails = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("category", "title")
      .populate("subcategory", "title")
      .populate("wannaBeInterest", "title")
      .select("title _id category subcategory wannaBeInterest");

    res.json({ courses });
  } catch (error) {
    console.error("Error fetching courses with details:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};


const getMyAdminProfile = async (req, res) => {
  try {
    console.log("Requesting Admin ID:", req.admin); // Add this
    const admin = await Admin.findById(req.admin.id).select("-password");


    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.json({ admin });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("category", "title")
      .populate("subcategory", "title")
      .populate("wannaBeInterest", "title")
      .select("title photo realPrice discountedPrice createdBy category subcategory wannaBeInterest");

    console.log("Fetched raw courses:", courses.map(course => ({
      id: course._id,
      category: course.category,
      subcategory: course.subcategory,
      interest: course.wannaBeInterest
    })));

    const formatted = courses.map(course => ({
      id: course._id,
      title: course.title,
      photo: course.photo,
      realPrice: course.realPrice,
      discountedPrice: course.discountedPrice,
      createdBy: course.createdBy || "Admin",
      category: course.category?.title || "N/A",
      subcategory: course.subcategory?.title || "N/A",
      interest: Array.isArray(course.wannaBeInterest) && course.wannaBeInterest.length > 0
        ? course.wannaBeInterest.map(i => i.title).join(", ")
        : "N/A"
    }));

    res.status(200).json({ courses: formatted });
  } catch (error) {
    console.error("Error fetching all courses:", error);
    res.status(500).json({ message: "Failed to fetch courses" });
  }
};




const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find()
      .populate("wannaBeInterest", "title")
      .select("title description photo category wannaBeInterest");

    res.status(200).json({
      subcategories: subcategories.map(s => ({
        _id: s._id,
        title: s.title,
        description: s.description,
        photo: s.photo,
        wannaBe: s.wannaBeInterest?.title || "N/A"
      }))
    });
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    res.status(500).json({ message: "Failed to fetch subcategories" });
  }
};


const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("wannaBeInterest", "title")
      .select("title description photo wannaBeInterest");

    res.status(200).json({
      categories: categories.map(c => ({
        _id: c._id,
        title: c.title,
        description: c.description,
        photo: c.photo,
        wannaBe: c.wannaBeInterest?.title || "N/A"
      }))
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
};

const getAllWannaBeInterests = async (req, res) => {
  try {
    const interests = await WannaBeInterest.find().select("title description image");
    res.status(200).json({ interests });
  } catch (error) {
    console.error("Error fetching WannaBeInterests:", error);
    res.status(500).json({ message: "Failed to fetch WannaBeInterests" });
  }
};

const getAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin._id; // comes from protectAdmin

    const admin = await Admin.findById(adminId).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ admin });
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    res.status(500).json({ message: "Failed to fetch admin profile" });
  }
};

const addReviewByAdmin = async (req, res) => {
  try {
    const { courseId, rating, comment } = req.body;
    const adminId = req.admin.id; // assuming you use adminProtect middleware

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized. Admin not found." });
    }

    const review = await Review.create({
      course: courseId,
      user: adminId,  // ✅ Set the admin ID here
      rating,
      comment,
    });

    res.status(201).json({ message: "Review submitted successfully", review });
  } catch (error) {
    console.error("Error creating review by admin:", error);
    res.status(500).json({ message: "Failed to submit review" });
  }
};

const getAllStudentsProgress = async (req, res) => {
  try {
    const students = await User.find({ role: "Student" }).populate({
      path: "enrolledCourses.course",
      model: "Course",
      select: "title",
    });

    const allProgress = [];

    for (const student of students) {
      const studentReport = {
        studentId: student._id,
        name: student.name,
        email: student.email,
        courses: [],
      };

      for (const enrolled of student.enrolledCourses) {
        if (!enrolled.course) continue; // ❌ Skip if course is not populated

        const lessons = await Lesson.find({ course: enrolled.course._id });

        const totalLessons = lessons.length;
        const completed = enrolled.completedLessons?.length || 0;
        const percent = totalLessons > 0 ? Math.round((completed / totalLessons) * 100) : 0;

        studentReport.courses.push({
          courseId: enrolled.course._id,
          title: enrolled.course.title,
          totalLessons,
          completedLessons: completed,
          progressPercent: percent,
          isCourseComplete: completed === totalLessons,
        });
      }

      allProgress.push(studentReport);
    }

    res.json({ students: allProgress });
  } catch (error) {
    console.error("❌ Error in admin progress view:", error);
    res.status(500).json({ message: "Failed to fetch student progress" });
  }
};

const getAssignmentByLessonId = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    if (!lesson.assignments || lesson.assignments.length === 0) {
      return res.status(404).json({ message: "No assignment found in this lesson" });
    }

    res.json({ assignments: lesson.assignments });
  } catch (error) {
    console.error("❌ Error fetching lesson assignment:", error);
    res.status(500).json({ message: "Failed to fetch assignment" });
  }
};
const getBatchStudents = async (req, res) => {
  const { batchId } = req.params;

  try {
    const batch = await Batch.findById(batchId).populate("students", "name email role status");

    if (!batch) {
      return res.status(404).json({ message: "Batch not found" });
    }

    res.json({
      batchName: batch.name,
      studentCount: batch.students.length,
      students: batch.students,
    });
  } catch (error) {
    console.error("❌ Error fetching batch students:", error);
    res.status(500).json({ message: "Failed to fetch batch students" });
  }
};


const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("user", "name email")        // ✅ Show reviewer info
      .populate("course", "title")           // ✅ Show course title
      .sort({ createdAt: -1 });              // 🔽 Newest first

    res.status(200).json({ reviews });
  } catch (error) {
    console.error("❌ Failed to fetch reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
};


const getUserProfileById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      photo: user.photo ? `${process.env.BASE_URL}/uploads/profile/${user.photo}` : null,
      isVerified: user.isVerified,
      status: user.status,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("❌ Error fetching user profile:", error);
    res.status(500).json({ message: "Failed to fetch user profile" });
  }
};
const toggleUserBanStatus = async (req, res) => {
  try {
    const userId = req.params.id;
    const { banned } = req.body; // expect true or false

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.banned = banned;
    await user.save();

    res.status(200).json({
      message: `User has been ${banned ? "banned" : "unbanned"}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        banned: user.banned,
      },
    });
  } catch (error) {
    console.error("❌ Error banning/unbanning user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const createTransaction = async (req, res) => {
  try {
    const { userId, courseId, amount, amountPaid } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({ message: "userId and courseId are required" });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const existingTxn = await Transaction.findOne({
      user: userId,
      course: courseId,
      status: { $in: ["Pending", "Paid"] },
    });

    if (existingTxn) {
      return res.status(400).json({ message: "Transaction already exists for this course" });
    }

    const finalAmount = amountPaid || amount || course.discountedPrice || course.realPrice;

    const txn = await Transaction.create({
      user: userId,
      course: course._id,
      amount: finalAmount,
      status: "Pending",
    });

    res.status(201).json({
      message: "Transaction initiated successfully",
      transaction: txn,
    });
  } catch (error) {
    console.error("❌ Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserTransactions = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }

    const transactions = await Transaction.find({ user: userId })
      .populate("course", "title realPrice discountedPrice") // optional: shows course details
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      message: "Transactions fetched successfully",
      transactions,
    });
  } catch (error) {
    console.error("❌ Error fetching user transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// controllers/adminController.js



const markTransactionAsPaid = async (req, res) => {
  try {
    const transactionId = req.params.id;

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (transaction.status === "Paid") {
      return res.status(400).json({ message: "Transaction is already marked as paid" });
    }

    transaction.status = "Paid";
    await transaction.save();

    res.status(200).json({
      message: "Transaction marked as paid successfully",
      transaction,
    });
  } catch (error) {
    console.error("❌ Error marking transaction as paid:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateAdminProfile = async (req, res) => {
  try {
    const adminId = req.admin?.id; // ✅ From JWT decoded payload via adminProtect

    if (!adminId) {
      return res.status(401).json({ message: "Unauthorized: No admin ID" });
    }

    const updates = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      bio: req.body.bio,
    };

    // ✅ Handle profile photo upload from form-data
    if (req.file) {
      updates.photo = req.file.path;
    } else if (req.body.photo) {
      updates.photo = req.body.photo;
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updates, {
      new: true,
    });

    if (!updatedAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.status(200).json({
      message: "Admin profile updated successfully",
      admin: updatedAdmin,
    });
  } catch (error) {
    console.error("❌ Error updating admin profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getStudentBatchesByAdmin = async (req, res) => {
  const { studentId } = req.params;

  try {
    const student = await User.findById(studentId);
    if (!student || student.role !== "Student") {
      return res.status(404).json({ message: "Student not found" });
    }

    const batches = await Batch.find({ students: studentId })
      .populate({ path: "course", select: "title" }) // Only get course _id and title
      .select("name course"); // Only get batch name and course reference

    // Transform to show only required fields
    const simplifiedBatches = batches.map(batch => ({
      batchId: batch._id,
      batchName: batch.name,
      courseId: batch.course?._id,
      courseName: batch.course?.title
    }));

    res.status(200).json({
      student: {
        _id: student._id,
        name: student.name,
        email: student.email
      },
      batches: simplifiedBatches
    });
  } catch (error) {
    console.error("Error fetching student batches:", error);
    res.status(500).json({ message: error.message });
  }
};


module.exports = { registerAdmin,getStudentBatchesByAdmin,updateAssignedMentorsToManager,updateAdminProfile,markTransactionAsPaid,toggleUserBanStatus,getUserProfileById,getAllReviews,getBatchStudents,getAssignmentByLessonId,deleteBatch,deleteCourse,deleteAnnouncement,deleteTicket,deletePromoCode,getAllStudentsProgress,addReviewByAdmin,getAdminProfile,getAllWannaBeInterests,getAllCourseCreators,getAllCourses,getAllSubcategories,getAllCategories,getMyAdminProfile,getCoursesWithDetails,loginAdmin,approveUser,
   getPendingApprovals,approveMentor,getPendingMentors,getPendingApprovals ,getAllBatches,getUserProfile, approveOrRejectBlog,
   getUsersByRole, getPlatformAnalytics, updateUserStatus,createTransaction,
   getAllTransactions, exportTransactionsCSV ,getAllJobs,getStudentsByCourseId,getUserTransactions,getAllBlogs,assignMentorsToManager,getAllSubmittedAssignments,getAllCertificates,getBatchesByCourseId};
