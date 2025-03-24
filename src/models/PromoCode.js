const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // Unique promo code
  discountPercentage: { type: Number, required: true, min: 1, max: 100 }, // Discount %
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // Optional (for course-specific discount)
  path: { type: mongoose.Schema.Types.ObjectId, ref: "Path" },
   // Optional (for path-specific discount)
  isActive: { type: Boolean, default: true }, // Status of promo code
  validUntil: { type: Date, required: true }, // Expiry date
}, { timestamps: true });

const PromoCode = mongoose.model("PromoCode", promoCodeSchema);

module.exports = PromoCode;
