const express = require("express");
const { createSubcategory, getAllSubcategories,getSubcategoriesByCategory } = require("../controllers/subcategoryController");
const { adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", adminProtect, createSubcategory);
router.get("/", adminProtect, getAllSubcategories);

// Get subcategories by category ID (Protected)
router.get("/category/:categoryId", adminProtect, getSubcategoriesByCategory);
module.exports = router;
