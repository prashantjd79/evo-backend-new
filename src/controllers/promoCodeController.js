



const PromoCode = require("../models/PromoCode");

const Course = require("../models/Course");




const createPromoCode = async (req, res) => {
  try {
    const { code, discountPercentage, courseId, validUntil, usageLimit } = req.body;

    // ✅ Validate courseId if provided
    if (courseId) {
      const courseExists = await Course.findById(courseId);
      if (!courseExists) {
        return res.status(400).json({ message: "Invalid Course ID. Course does not exist." });
      }
    }

    // ✅ Prevent both course & path
    if (!courseId && !usageLimit) {
      return res.status(400).json({ message: "Promo code must be linked to a course or be overall (with usage limit)" });
    }

    const promoCode = await PromoCode.create({
      code,
      discountPercentage,
      course: courseId || null,
      validUntil: courseId ? validUntil : null,
      usageLimit: usageLimit || null,
      usageCount: 0,
      isActive: true
    });

    res.status(201).json({ message: "Promo code created successfully", promoCode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const applyPromoCode = async (req, res) => {
  const { code, courseId } = req.body;

  try {
    const promo = await PromoCode.findOne({ code });

    if (!promo || !promo.isActive) {
      return res.status(404).json({ message: "Invalid or inactive promo code" });
    }

    // Course specific promo
    if (promo.course) {
      if (promo.course.toString() !== courseId) {
        return res.status(400).json({ message: "This code is not valid for this course" });
      }

      if (promo.validUntil && new Date(promo.validUntil) < new Date()) {
        return res.status(400).json({ message: "Promo code has expired" });
      }

      return res.status(200).json({
        message: "Promo code applied successfully",
        discountPercentage: promo.discountPercentage,
        target: "course"
      });
    }

    // Overall promo
    if (promo.usageLimit && promo.usageCount >= promo.usageLimit) {
      return res.status(400).json({ message: "Promo code usage limit reached" });
    }

    // Increment usage count
    promo.usageCount += 1;
    await promo.save();

    return res.status(200).json({
      message: "Promo code applied successfully",
      discountPercentage: promo.discountPercentage,
      target: "overall"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getAllPromoCodes = async (req, res) => {
  try {
    const promoCodes = await PromoCode.find()
      .populate("course", "title") // populate course title if it's course-specific
      .sort({ createdAt: -1 });

    res.json({ promoCodes });
  } catch (error) {
    console.error("Error fetching promo codes:", error);
    res.status(500).json({ message: "Failed to fetch promo codes" });
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



module.exports = { createPromoCode, getAllPromoCodes, updatePromoStatus,applyPromoCode };
