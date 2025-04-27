const Subcategory = require("../models/Subcategory");
const Category = require("../models/Category");
const slugify = require("slugify");


const createSubcategory = async (req, res) => {
  const { title, description, categoryId } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    let generatedSlug = slugify(title, { lower: true, strict: true });

    // 🟢 Check if a subcategory with same slug already exists
    const existingSubcategory = await Subcategory.findOne({ slug: generatedSlug });
    if (existingSubcategory) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      generatedSlug = `${generatedSlug}-${randomSuffix}`;
    }
    const photo = req.file ? `subcategory/${req.file.filename}` : null;

    const subcategory = await Subcategory.create({
      title,
      description,
      slug: generatedSlug,
      category: categoryId,
      photo,
    });

    res.status(201).json({
      message: "Subcategory created successfully",
      subcategory: {
        _id: subcategory._id,
        title: subcategory.title,
        description: subcategory.description,
        photo: subcategory.photo,
        slug: subcategory.slug,
        category: subcategory.category,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const createSubcategory = async (req, res) => {
//   const { title, description, categoryId } = req.body;

//   try {
//     const category = await Category.findById(categoryId);
//     if (!category) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     // 🟢 Generate slug from title
//     let generatedSlug = slugify(title, { lower: true, strict: true });

//     // 🟢 Check if a subcategory with same slug already exists
//     const existingSubcategory = await Subcategory.findOne({ slug: generatedSlug });
//     if (existingSubcategory) {
//       const randomSuffix = Math.floor(1000 + Math.random() * 9000);
//       generatedSlug = `${generatedSlug}-${randomSuffix}`;
//     }

//     const photo = req.file ? `subcategory/${req.file.filename}` : null;

//     const subcategory = await Subcategory.create({
//       title,
//       slug: generatedSlug, // 🟢 Save slug
//       description,
//       category: categoryId,
//       photo,
//     });

//     res.status(201).json({
//       message: "Subcategory created successfully",
//       subcategory: {
//         _id: subcategory._id,
//         title: subcategory.title,
//         slug: subcategory.slug, // 🟢 Return slug
//         description: subcategory.description,
//         photo: subcategory.photo,
//         category: subcategory.category,
//       },
//     });

//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



const getSubcategoriesByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Check if categoryId exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Fetch subcategories for this category
    const subcategories = await Subcategory.find({ category: categoryId })
    .select("title slug description photo category");
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all subcategories
const getAllSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find();
    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Subcategory.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.status(200).json({ message: "Subcategory deleted successfully", deleted });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({ message: "Failed to delete subcategory" });
  }
};
const updateSubcategory = async (req, res) => {
  try {
    const subcategoryId = req.params.id;
    const { title, description, categoryId } = req.body;
    const photo = req.file ? `subcategory/${req.file.filename}` : undefined;

    const subcategory = await Subcategory.findById(subcategoryId);
    if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });

    // Update title & slug
    if (title && title !== subcategory.title) {
      let generatedSlug = slugify(title, { lower: true, strict: true });

      const existingSubcategory = await Subcategory.findOne({ slug: generatedSlug, _id: { $ne: subcategoryId } });
      if (existingSubcategory) {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        generatedSlug = `${generatedSlug}-${randomSuffix}`;
      }

      subcategory.title = title;
      subcategory.slug = generatedSlug;
    }

    if (description) subcategory.description = description;
    if (photo) subcategory.photo = photo;
    if (categoryId) subcategory.category = categoryId;

    await subcategory.save();

    res.json({ message: "Subcategory updated successfully", subcategory });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getSubcategoryBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const subcategory = await Subcategory.findOne({ slug }).select("title slug description photo category");

    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.json(subcategory);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createSubcategory,getSubcategoryBySlug, getAllSubcategories,getSubcategoriesByCategory,deleteSubcategory,updateSubcategory };
