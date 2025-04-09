const express = require("express");
const { createSubcategory, getAllSubcategories,getSubcategoriesByCategory } = require("../controllers/subcategoryController");
const { adminProtect } = require("../middleware/authMiddleware");
const uploadSubcategoryIcon = require("../middleware/uploadSubcategory");
const router = express.Router();

// router.post("/", adminProtect, createSubcategory);

router.post(
    "/",
    adminProtect,
    uploadSubcategoryIcon.single("photo"),
    createSubcategory
  );

router.get("/", adminProtect, getAllSubcategories);

// Get subcategories by category ID (Protected)
router.get("/category/:categoryId",getSubcategoriesByCategory);
module.exports = router;
