const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Student or Employer
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // Optional (for course purchases)
  path: { type: mongoose.Schema.Types.ObjectId, ref: "Path" }, // Optional (for path purchases)
  amount: { type: Number, required: true }, // Total amount after discount
  originalAmount: { type: Number, required: true }, // Original price before discount
  discountApplied: { type: Number, default: 0 }, // Discount percentage applied
  promoCode: { type: String }, // Applied promo code
  paymentMethod: { type: String, enum: ["Credit Card", "PayPal", "Bank Transfer"], required: true },
  status: { type: String, enum: ["Completed", "Pending", "Failed"], default: "Completed" },
  transactionDate: { type: Date, default: Date.now }
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
