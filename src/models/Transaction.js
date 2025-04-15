const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" }, // optional
  path: { type: mongoose.Schema.Types.ObjectId, ref: "Path" },     // optional
  amount: { type: Number },
  paymentMethod: { type: String },
  status: { type: String },
  transactionDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Transaction", transactionSchema);
