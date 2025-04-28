const express = require("express");
const { createCategory, getCategories,deleteCategory,updateCategory,getCategoryBySlug } = require("../controllers/categoryController");
const { adminProtect } = require("../middleware/authMiddleware");
const uploadCategoryIcon = require("../middleware/uploadCategory");
const router = express.Router();

// router.post("/", adminProtect, createCategory);

router.post(
    "/",
    adminProtect,
    uploadCategoryIcon.single("photo"),
    createCategory
  );
  router.get("/slug/:slug", getCategoryBySlug);

  router.put("/update/:id", adminProtect, uploadCategoryIcon.single("photo"), updateCategory);
router.get("/", getCategories);
router.delete("/category/:id", adminProtect, deleteCategory);

module.exports = router;
