const Category = require("../models/Category");
const slugify = require("slugify");



const createCategory = async (req, res) => {
  const { title, description } = req.body;

  try {
    // Check for duplicate
    const exists = await Category.findOne({ title });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    

    let generatedSlug = slugify(title, { lower: true, strict: true });
    const existingCategory = await Category.findOne({ slug: generatedSlug });
    if (existingCategory) {
      // If exists, add random 4-digit number
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      generatedSlug = `${generatedSlug}-${randomSuffix}`;
    }

    // Get uploaded file
    const photo = req.file ? `category/${req.file.filename}` : null;

    // Create category
    const category = await Category.create({ title, description,  slug: generatedSlug, photo });

    res.status(201).json({
      message: "Category created successfully",
      category: {
        _id: category._id,
        title: category.title,
        slug: category.slug,
        description: category.description,
        photo: category.photo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const createCategory = async (req, res) => {
//   const { title, description } = req.body;

//   try {
//     // Check for duplicate title
//     const exists = await Category.findOne({ title });
//     if (exists) return res.status(400).json({ message: "Category already exists" });

//     // 🟢 Generate Slug
//     let generatedSlug = slugify(title, { lower: true, strict: true });

//     // 🟢 Check if a category with same slug already exists
//     const existingCategory = await Category.findOne({ slug: generatedSlug });
//     if (existingCategory) {
//       // If exists, add random 4-digit number
//       const randomSuffix = Math.floor(1000 + Math.random() * 9000);
//       generatedSlug = `${generatedSlug}-${randomSuffix}`;
//     }

//     // Handle uploaded photo
//     const photo = req.file ? `category/${req.file.filename}` : null;

//     // Create category
//     const category = await Category.create({
//       title,
//       slug: generatedSlug, // 🟢 Save the slug
//       description,
//       photo
//     });

//     res.status(201).json({
//       message: "Category created successfully",
//       category: {
//         _id: category._id,
//         title: category.title,
//         slug: category.slug, // 🟢 Return slug too
//         description: category.description,
//         photo: category.photo,
//       },
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// Get all Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().select("title slug description photo");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Category.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({ message: "Category deleted successfully", deleted });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Failed to delete category" });
  }
};
const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { title, description } = req.body;
    const photo = req.file ? `category/${req.file.filename}` : undefined;

    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Update title & slug
    if (title && title !== category.title) {
      let generatedSlug = slugify(title, { lower: true, strict: true });

      const existingCategory = await Category.findOne({ slug: generatedSlug, _id: { $ne: categoryId } });
      if (existingCategory) {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        generatedSlug = `${generatedSlug}-${randomSuffix}`;
      }

      category.title = title;
      category.slug = generatedSlug;
    }

    if (description) category.description = description;
    if (photo) category.photo = photo;

    await category.save();

    res.json({ message: "Category updated successfully", category });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getCategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug }).select("title slug description photo");

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createCategory,getCategoryBySlug, getCategories,deleteCategory,updateCategory };
