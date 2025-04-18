const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },
    paymentId: { type: String },       // Optional: if integrating Razorpay, Stripe
    paymentMethod: { type: String },   // Optional: e.g. "Card", "UPI"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
