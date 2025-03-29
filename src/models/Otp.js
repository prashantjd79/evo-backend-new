const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  data: { type: Object, required: true }, // temporarily store user data
  expiresAt: { type: Date, default: Date.now, index: { expires: '10m' } }, // OTP expires after 10 mins
});

module.exports = mongoose.model("Otp", otpSchema);
