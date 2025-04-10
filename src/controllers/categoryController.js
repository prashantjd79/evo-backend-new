const Category = require("../models/Category");

const createCategory = async (req, res) => {
  const { title, description } = req.body;

  try {
    // Check for duplicate
    const exists = await Category.findOne({ title });
    if (exists) return res.status(400).json({ message: "Category already exists" });

    // Get uploaded file
    const photo = req.file ? `category/${req.file.filename}` : null;

    // Create category
    const category = await Category.create({ title, description, photo });

    res.status(201).json({
      message: "Category created successfully",
      category: {
        _id: category._id,
        title: category.title,
        description: category.description,
        photo: category.photo,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
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

module.exports = { createCategory, getCategories,deleteCategory };
