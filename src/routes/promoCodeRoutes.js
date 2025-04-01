const express = require("express");
const { createPromoCode,applyPromoCode, getAllPromoCodes, updatePromoStatus,  } = require("../controllers/promoCodeController");
const { adminProtect, studentProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", adminProtect, createPromoCode); // Create promo code
router.post("/apply",studentProtect,applyPromoCode);
router.get("/promocodes", adminProtect, getAllPromoCodes); // Get all promo codes
router.put("/status", adminProtect, updatePromoStatus); 
// Activate/Deactivate a promo code
 // Apply a promo code

module.exports = router;
