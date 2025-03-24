const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Mentor = require("../models/Mentor");
const Blog = require("../models/Blog");

const Transaction = require("../models/Transaction");
const { Parser } = require("json2csv"); // For CSV export
const fs = require("fs");

// Get Transactions (Filter by Course & Path)
const getTransactions = async (req, res) => {
  const { courseId, pathId } = req.query;

  try {
    let filter = {};
    if (courseId) filter.course = courseId;
    if (pathId) filter.path = pathId;

    const transactions = await Transaction.find(filter)
      .populate("user", "name email")
      .populate("course", "name")
      .populate("path", "name");

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export Transactions as CSV
const exportTransactionsCSV = async (req, res) => {
  const { courseId, pathId } = req.query;

  try {
    let filter = {};
    if (courseId) filter.course = courseId;
    if (pathId) filter.path = pathId;

    const transactions = await Transaction.find(filter)
      .populate("user", "name email")
      .populate("course", "name")
      .populate("path", "name");

    if (transactions.length === 0) {
      return res.status(404).json({ message: "No transactions found for the given filters." });
    }

    // Convert transactions to CSV format
    const fields = ["User", "Email", "Course", "Path", "Amount", "Payment Method", "Status", "Transaction Date"];
    const data = transactions.map(txn => ({
      User: txn.user?.name || "N/A",
      Email: txn.user?.email || "N/A",
      Course: txn.course?.name || "N/A",
      Path: txn.path?.name || "N/A",
      Amount: txn.amount,
      "Payment Method": txn.paymentMethod,
      Status: txn.status,
      "Transaction Date": txn.transactionDate.toISOString()
    }));

    const parser = new Parser({ fields });
    const csv = parser.parse(data);

    // Save CSV file
    const filePath = `./exports/transactions_${Date.now()}.csv`;
    fs.writeFileSync(filePath, csv);

    res.download(filePath, "transactions.csv", () => {
      fs.unlinkSync(filePath); // Delete file after download
    });
  } catch (error) {
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



module.exports = { registerAdmin, loginAdmin,approveUser,
   getPendingApprovals,approveMentor,getPendingMentors,getPendingApprovals ,getUserProfile, approveOrRejectBlog,
   getUsersByRole, getPlatformAnalytics, updateUserStatus,
   getTransactions, exportTransactionsCSV ,getAllBlogs,assignMentorsToManager};
