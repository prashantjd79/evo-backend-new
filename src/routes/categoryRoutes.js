const express = require("express");
const { createCategory, getCategories } = require("../controllers/categoryController");
const { adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", adminProtect, createCategory);
router.get("/", adminProtect, getCategories);

module.exports = router;
