const Course = require("../models/Course");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const WannaBeInterest = require("../models/WannaBeInterest");




const assignWannaBeInterestToCourse = async (req, res) => {
  const { courseId, wannaBeInterestIds } = req.body; // Expect an array of WannaBeInterest IDs

  try {
    // Validate courseId
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Validate each wannaBeInterestId
    const validWannaBeInterests = await WannaBeInterest.find({ _id: { $in: wannaBeInterestIds } });

    // If some IDs are invalid, return an error
    if (validWannaBeInterests.length !== wannaBeInterestIds.length) {
      return res.status(400).json({ message: "Some WannaBeInterest IDs are invalid" });
    }

    // Assign validated WannaBeInterest IDs to the course
    course.wannaBeInterest = wannaBeInterestIds;
    await course.save();

    res.json({ message: "WannaBeInterest assigned successfully", course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// const createCourse = async (req, res) => {
//   const { name, description, categoryId, subcategoryId, wannaBeInterestId } = req.body;

//   try {
//     // Validate categoryId
//     const category = await Category.findById(categoryId);
//     if (!category) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     // Validate subcategoryId
//     const subcategory = await Subcategory.findById(subcategoryId);
//     if (!subcategory) {
//       return res.status(404).json({ message: "Subcategory not found" });
//     }

//     // Validate WannaBeInterestId
//     const wannaBeInterest = await WannaBeInterest.findById(wannaBeInterestId);
//     if (!wannaBeInterest) {
//       return res.status(404).json({ message: "WannaBeInterest not found" });
//     }

//     // Create course only if all IDs exist
//     const course = await Course.create({
//       name,
//       description,
//       category: categoryId,
//       subcategory: subcategoryId,
//       wannaBeInterest: wannaBeInterestId, // ✅ Store the validated reference
//     });

//     res.status(201).json({ message: "Course created successfully", course });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };




const createCourse = async (req, res) => {
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
      tags,
      createdBy,
      review // ✅ Admin can provide a review during creation
    } = req.body;

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

    // ✅ Validate WannaBeInterest
    const validWannaBeInterests = await WannaBeInterest.find({
      _id: { $in: parsedWannaBeInterestIds }
    });

    if (validWannaBeInterests.length !== parsedWannaBeInterestIds.length) {
      return res.status(400).json({ message: "Some WannaBeInterest IDs are invalid" });
    }

    // ✅ Handle file upload path
    const photo = req.file ? `course/${req.file.filename}` : null;

    // ✅ Optional tags
    const parsedTags = tags?.split(",").map(tag => tag.trim()) || [];

    // ✅ Admin review setup
    const reviews = review
      ? [{
          student: null,
          rating: 5,
          comment: review,
          createdAt: new Date()
        }]
      : [];

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
      reviews,
      createdBy: createdBy || "Admin"
    });

    res.status(201).json({ message: "Course created successfully", course });

  } catch (error) {
    console.error("Course creation failed:", error);
    res.status(500).json({ message: error.message });
  }
};





const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCourse, getCourseById,getAllCourses ,assignWannaBeInterestToCourse};
