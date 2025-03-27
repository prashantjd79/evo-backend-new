const mongoose = require("mongoose");

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercentage: { type: Number, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", default: null },
  // Removed path

  validUntil: { type: Date }, // Only for course-specific promos

  // Only for overall promos
  usageLimit: { type: Number },
  usageCount: { type: Number, default: 0 },

  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("PromoCode", promoCodeSchema);
