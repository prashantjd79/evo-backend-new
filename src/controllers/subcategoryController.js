const Subcategory = require("../models/Subcategory");
const Category = require("../models/Category");



const createSubcategory = async (req, res) => {
  const { title, description, categoryId } = req.body;

  try {
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const photo = req.file ? `subcategory/${req.file.filename}` : null;

    const subcategory = await Subcategory.create({
      title,
      description,
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
        category: subcategory.category,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





const getSubcategoriesByCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    // Check if categoryId exists
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // Fetch subcategories for this category
    const subcategories = await Subcategory.find({ category: categoryId });

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

module.exports = { createSubcategory, getAllSubcategories,getSubcategoriesByCategory };
