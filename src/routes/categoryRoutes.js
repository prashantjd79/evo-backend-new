const express = require("express");
const { createCategory, getCategories,deleteCategory } = require("../controllers/categoryController");
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

router.get("/", adminProtect, getCategories);
router.delete("/category/:id", adminProtect, deleteCategory);

module.exports = router;
