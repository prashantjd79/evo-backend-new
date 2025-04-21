const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Course = require("../models/Course");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const WannaBeInterest = require("../models/WannaBeInterest");
// Generate JWT Token
const generateToken = (_id, role, email) => {
  return jwt.sign({ _id, role, email }, process.env.JWT_SECRET, { expiresIn: "7d" });
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
      if (!courseCreator) {
        return res.status(400).json({ message: "Course Creator not found" });
      }
      if (courseCreator.banned) {
        return res.status(403).json({ message: "Your account has been banned by the admin." });
      }
      if (!courseCreator.isApproved) {
        return res.status(403).json({ message: "Your account is pending approval by admin." });
      }
  
      const isMatch = await bcrypt.compare(password, courseCreator.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
  
      const token = generateToken(courseCreator._id, courseCreator.role, courseCreator.email);
  
      console.log("✅ Token Payload:", {
        _id: courseCreator._id.toString(),
        role: courseCreator.role,
        email: courseCreator.email,
      });
  
      res.json({
        _id: courseCreator._id,
        name: courseCreator.name,
        email: courseCreator.email,
        role: courseCreator.role,
        token,
      });
    } catch (error) {
      console.error("❌ Login error:", error);
      res.status(500).json({ message: "Server error" });
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
  





  const updateCourseCreatorProfile = async (req, res) => {
    try {
      const creatorId = req.courseCreator?._id;
  
      if (!creatorId) {
        return res.status(401).json({ message: "Unauthorized: Course Creator not found" });
      }
  
      const updates = {
        username: req.body.username,
        email: req.body.email,
        dob: req.body.dob,
        contactNumber: req.body.contactNumber,
        address: req.body.address,
        workingMode: req.body.workingMode,
        education: req.body.education,
        about: req.body.about,
      };
  
      // ✅ Handle photo update
      if (req.file) {
        updates.photo = `coursecreators/${req.file.filename}`;
      } else if (req.body.photo) {
        updates.photo = req.body.photo;
      }
  
      const updatedCourseCreator = await User.findByIdAndUpdate(creatorId, updates, {
        new: true,
      }).select("-password");
  
      if (!updatedCourseCreator) {
        return res.status(404).json({ message: "Course Creator not found" });
      }
  
      res.status(200).json({
        message: "Course Creator profile updated successfully",
        courseCreator: updatedCourseCreator,
      });
    } catch (error) {
      console.error("❌ Error updating course creator profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };



  const updateCourseByCreator = async (req, res) => {
    try {
      const courseId = req.params.id;
  
      const course = await Course.findById(courseId);
      if (!course) return res.status(404).json({ message: "Course not found" });
  
      const updatedData = {
        title: req.body.title,
        description: req.body.description,
        whatYouWillLearn: req.body["whatYouWillLearn[]"] || req.body.whatYouWillLearn,
        youtubeLink: req.body.youtubeLink,
        timing: req.body.timing,
        categoryId: req.body.categoryId,
        subcategoryId: req.body.subcategoryId,
        wannaBeInterestIds: req.body["wannaBeInterestIds[]"] || req.body.wannaBeInterestIds,
        realPrice: req.body.realPrice,
        discountedPrice: req.body.discountedPrice,
        tags: req.body["tags[]"] || req.body.tags,
        review: req.body.review,
      };
  
      // Handle photo (if using multer)
      if (req.file) {
        updatedData.photo = req.file.path;
      }
  
      const updatedCourse = await Course.findByIdAndUpdate(courseId, updatedData, { new: true });
  
      res.status(200).json({
        message: "Course updated by Course Creator",
        course: updatedCourse,
      });
    } catch (error) {
      console.error("❌ Error in updateCourseByCreator:", error);
      res.status(500).json({ message: "Internal server error" });
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


module.exports = { registerCourseCreator,updateCourseCreatorProfile,loginCourseCreator,createCourseByCreator,updateCourseByCreator,getAllCourses,deleteCourse };
