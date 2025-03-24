const express = require("express");
const { createPromoCode, getAllPromoCodes, updatePromoStatus,  } = require("../controllers/promoCodeController");
const { adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", adminProtect, createPromoCode); // Create promo code
router.get("/", adminProtect, getAllPromoCodes); // Get all promo codes
router.put("/status", adminProtect, updatePromoStatus); 
// Activate/Deactivate a promo code
 // Apply a promo code

module.exports = router;
