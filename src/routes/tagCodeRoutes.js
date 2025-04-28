const express = require("express");
const { 
  createTagCode, 
  updateTagCode, 
  deleteTagCode, 
  getAllTagCodes 
} = require("../controllers/tagCodeController");

const { adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

// Create TagCode
router.post("/", adminProtect, createTagCode);

// Update TagCode
router.put("/:id", adminProtect, updateTagCode);

// Delete TagCode
router.delete("/:id", adminProtect, deleteTagCode);

// Get All TagCodes (Public)
router.get("/", getAllTagCodes);

module.exports = router;
