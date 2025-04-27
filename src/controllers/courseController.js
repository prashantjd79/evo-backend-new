const Course = require("../models/Course");
const Category = require("../models/Category");
const Subcategory = require("../models/Subcategory");
const WannaBeInterest = require("../models/WannaBeInterest");
const slugify = require("slugify");



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
//   try {
//     const {
//       title,
//       description,
//       whatYouWillLearn,
//       youtubeLink,
//       timing,
//       categoryId,
//       subcategoryId,
//       wannaBeInterestIds,
//       realPrice,
//       discountedPrice,
//       tags,
//       createdBy,
//       review // ✅ Admin can provide a review during creation
//     } = req.body;

//     // 🧠 Parse comma-separated WannaBeInterest IDs
//     let parsedWannaBeInterestIds = [];
//     if (typeof wannaBeInterestIds === "string") {
//       parsedWannaBeInterestIds = wannaBeInterestIds.split(",").map(id => id.trim());
//     }

//     // ✅ Validate category
//     const category = await Category.findById(categoryId);
//     if (!category) return res.status(404).json({ message: "Category not found" });

//     // ✅ Validate subcategory
//     const subcategory = await Subcategory.findById(subcategoryId);
//     if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });

//     // ✅ Validate WannaBeInterest
//     const validWannaBeInterests = await WannaBeInterest.find({
//       _id: { $in: parsedWannaBeInterestIds }
//     });

//     if (validWannaBeInterests.length !== parsedWannaBeInterestIds.length) {
//       return res.status(400).json({ message: "Some WannaBeInterest IDs are invalid" });
//     }

//     // ✅ Handle file upload path
//     const photo = req.file ? `course/${req.file.filename}` : null;

//     // ✅ Optional tags
//     const parsedTags = tags?.split(",").map(tag => tag.trim()) || [];

//     // ✅ Admin review setup
//     const reviews = review
//       ? [{
//           student: null,
//           rating: 5,
//           comment: review,
//           createdAt: new Date()
//         }]
//       : [];

//     // ✅ Create course
//     const course = await Course.create({
//       title,
//       description,
//       whatYouWillLearn,
//       youtubeLink,
//       timing,
//       category: categoryId,
//       subcategory: subcategoryId,
//       wannaBeInterest: parsedWannaBeInterestIds,
//       realPrice,
//       discountedPrice,
//       photo,
//       tags: parsedTags,
//       reviews,
//       createdBy: createdBy || "Admin"
//     });

//     res.status(201).json({ message: "Course created successfully", course });

//   } catch (error) {
//     console.error("Course creation failed:", error);
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

    // 🟢 Generate Slug from Title
    let generatedSlug = slugify(title, { lower: true, strict: true });

    // 🟢 Check if a course with same slug already exists
    const existingCourse = await Course.findOne({ slug: generatedSlug });
    if (existingCourse) {
      // If slug already exists, add a random 4-digit number to make it unique
      const randomSuffix = Math.floor(1000 + Math.random() * 9000); // generates a number between 1000-9999
      generatedSlug = `${generatedSlug}-${randomSuffix}`;
    }

    // ✅ Create course
    const course = await Course.create({
      title,
      slug: generatedSlug, // 🟢 Save the slug
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
    const courses = await Course.find()
    .select("title slug description realPrice discountedPrice tags photo category subcategory wannaBeInterest createdBy");
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
    .select("title slug description whatYouWillLearn youtubeLink timing realPrice discountedPrice tags photo category subcategory wannaBeInterest reviews createdBy");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const updateCourseByAdmin = async (req, res) => {
  try {
    const courseId = req.params.id;
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
      review
    } = req.body;

    const parsedTags = tags?.split(",").map(tag => tag.trim()) || [];
    const parsedWannaBeInterestIds = wannaBeInterestIds?.split(",").map(id => id.trim()) || [];

    // Validate inputs
    const category = await Category.findById(categoryId);
    const subcategory = await Subcategory.findById(subcategoryId);
    const validWannaBe = await WannaBeInterest.find({ _id: { $in: parsedWannaBeInterestIds } });

    if (!category || !subcategory || validWannaBe.length !== parsedWannaBeInterestIds.length) {
      return res.status(400).json({ message: "Invalid Category/Subcategory/WannaBeInterest" });
    }

    const photo = req.file ? `course/${req.file.filename}` : undefined;

    const updatedFields = {
      title, description, whatYouWillLearn, youtubeLink, timing,
      category: categoryId,
      subcategory: subcategoryId,
      wannaBeInterest: parsedWannaBeInterestIds,
      realPrice, discountedPrice,
      tags: parsedTags,
      createdBy,
    };

    if (photo) updatedFields.photo = photo;
    if (review) {
      updatedFields.reviews = [{
        student: null,
        rating: 5,
        comment: review,
        createdAt: new Date()
      }];
    }

    if (title) {
      let generatedSlug = slugify(title, { lower: true, strict: true });

      const existingSlugCourse = await Course.findOne({ slug: generatedSlug, _id: { $ne: courseId } });
      if (existingSlugCourse) {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        generatedSlug = `${generatedSlug}-${randomSuffix}`;
      }

      updatedFields.slug = generatedSlug; // 🟢 Assign the updated slug
    }

    const course = await Course.findByIdAndUpdate(courseId, updatedFields, { new: true });
    if (!course) return res.status(404).json({ message: "Course not found" });

    res.json({ message: "Course updated by Admin", course });

  } catch (error) {
    console.error("❌ Admin update failed:", error);
    res.status(500).json({ message: error.message });
  }
};

const getCourseBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const course = await Course.findOne({ slug })
      .select("title slug description whatYouWillLearn youtubeLink timing realPrice discountedPrice tags photo category subcategory wannaBeInterest reviews createdBy");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCourse,getCourseBySlug,updateCourseByAdmin,getCourseById,getAllCourses ,assignWannaBeInterestToCourse};
