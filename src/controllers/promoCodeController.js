



const PromoCode = require("../models/PromoCode");





// Create a Promo Code
const createPromoCode = async (req, res) => {
  const { code, discountPercentage, courseId, pathId, validUntil } = req.body;

  try {
    // Ensure that a promo code is associated with either a course or a path (not both)
    if (!courseId && !pathId) {
      return res.status(400).json({ message: "Promo code must be linked to either a Course or a Path." });
    }

    const promoCode = await PromoCode.create({
      code,
      discountPercentage,
      course: courseId || null,
      path: pathId || null,
      validUntil,
      isActive: true
    });

    res.status(201).json({ message: "Promo code created successfully", promoCode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Promo Codes
const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find()
      .populate("course", "name")
      .populate("path", "name");

    res.json(promoCodes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Activate/Deactivate Promo Code
const updatePromoStatus = async (req, res) => {
  const { promoId, isActive } = req.body;

  try {
    const promoCode = await PromoCode.findById(promoId);
    if (!promoCode) return res.status(404).json({ message: "Promo code not found" });

    promoCode.isActive = isActive;
    await promoCode.save();

    res.json({ message: `Promo code ${isActive ? "activated" : "deactivated"} successfully`, promoCode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { createPromoCode, getAllPromoCodes, updatePromoStatus };
