const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Course = require("../models/Course");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const WannaBeInterest = require("../models/WannaBeInterest");
// Generate JWT Token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
  };
  

  const registerCourseCreator = async (req, res) => {
    const {
      name,
      username,
      email,
      password,
      dob,
      contactNumber,
      address,
      workingMode,
      education,
      about,
    } = req.body;
  
    try {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "Email already registered" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const courseCreator = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        role: "Course Creator",
        isApproved: false,
        dob,
        contactNumber,
        address,
        workingMode,
        education,
        bio: about,
        photo: req.file?.path || "",
      });
  
      res.status(201).json({
        message: "Course Creator registered successfully. Awaiting admin approval.",
        courseCreator,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  

const loginCourseCreator = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const courseCreator = await User.findOne({ email, role: "Course Creator" });
      if (!courseCreator) return res.status(400).json({ message: "Course Creator not found" });
  
      if (!courseCreator.isApproved) return res.status(403).json({ message: "Your account is pending approval by admin." });
  
      const isMatch = await bcrypt.compare(password, courseCreator.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });
  
      res.json({
        _id: courseCreator.id,
        name: courseCreator.name,
        email: courseCreator.email,
        role: courseCreator.role,
        token: generateToken(courseCreator.id, courseCreator.role), // ✅ Role included
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  


  const createCourseByCreator = async (req, res) => {
    try {
      const {
        title,
        description,
        whatYouWillLearn,
        youtubeLink,
        timing,
        categoryId,
        subcategoryId,
        wannaBeInterestIds,
        realPrice,
        discountedPrice,
        tags
      } = req.body;
  
      // 👤 Ensure creator identity is set via middleware
      const createdBy = req.user?.name || req.user?.email || "Course Creator";
  
      // 🧠 Parse comma-separated WannaBeInterest IDs
      let parsedWannaBeInterestIds = [];
      if (typeof wannaBeInterestIds === "string") {
        parsedWannaBeInterestIds = wannaBeInterestIds.split(",").map(id => id.trim());
      }
  
      // ✅ Validate category
      const category = await Category.findById(categoryId);
      if (!category) return res.status(404).json({ message: "Category not found" });
  
      // ✅ Validate subcategory
      const subcategory = await Subcategory.findById(subcategoryId);
      if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });
  
      // ✅ Validate WannaBeInterest IDs
      const validWannaBeInterests = await WannaBeInterest.find({
        _id: { $in: parsedWannaBeInterestIds }
      });
  
      if (validWannaBeInterests.length !== parsedWannaBeInterestIds.length) {
        return res.status(400).json({ message: "Some WannaBeInterest IDs are invalid" });
      }
  
      // ✅ Handle file upload for course photo
      const photo = req.file ? `course/${req.file.filename}` : null;
  
      // ✅ Parse tags
      const parsedTags = tags?.split(",").map(tag => tag.trim()) || [];
  
      // ✅ Create course
      const course = await Course.create({
        title,
        description,
        whatYouWillLearn,
        youtubeLink,
        timing,
        category: categoryId,
        subcategory: subcategoryId,
        wannaBeInterest: parsedWannaBeInterestIds,
        realPrice,
        discountedPrice,
        photo,
        tags: parsedTags,
        reviews: [],
        createdBy // could be creator’s name/email
      });
  
      res.status(201).json({ message: "Course created successfully", course });
    } catch (error) {
      console.error("Course creation by creator failed:", error);
      res.status(500).json({ message: error.message });
    }
  };
  

const updateCourse = async (req, res) => {
  const { courseId } = req.params;
  const { name, description, categoryId, subcategoryId, wannaBeInterest } = req.body;

  try {
      // Check if course exists
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });

      // Validate category if updated
      if (categoryId) {
          const category = await Category.findById(categoryId);
          if (!category) return res.status(404).json({ message: "Category not found" });
      }

      // Validate subcategory if updated
      if (subcategoryId) {
          const subcategory = await Subcategory.findById(subcategoryId);
          if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });
      }

      // Validate WannaBeInterest if updated
      if (wannaBeInterest) {
          const validWannaBeInterests = await WannaBeInterest.find({ _id: { $in: wannaBeInterest } });
          if (validWannaBeInterests.length !== wannaBeInterest.length) {
              return res.status(404).json({ message: "One or more WannaBeInterest IDs are invalid" });
          }
      }

      // Update course details
      course.name = name || course.name;
      course.description = description || course.description;
      course.category = categoryId || course.category;
      course.subcategory = subcategoryId || course.subcategory;
      course.wannaBeInterest = wannaBeInterest || course.wannaBeInterest;

      await course.save();

      res.json({ message: "Course updated successfully", course });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};

const getAllCourses = async (req, res) => {
  try {
      const courses = await Course.find()
          .populate("category", "name")
          .populate("subcategory", "name")
          .populate("wannaBeInterest", "name");

      res.json(courses);
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};
const deleteCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
      // Check if course exists
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });

      await course.deleteOne();
      res.json({ message: "Course deleted successfully" });
  } catch (error) {
      res.status(500).json({ message: error.message });
  }
};


module.exports = { registerCourseCreator, loginCourseCreator,createCourseByCreator,updateCourse,getAllCourses,deleteCourse };
