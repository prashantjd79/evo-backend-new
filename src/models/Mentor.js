// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const mentorSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   expertise: { type: String, required: true }, // e.g. "Full Stack Development"
//   isApproved: { type: Boolean, default: false }, // Admin approval required
// }, { timestamps: true });

// // Hash password before saving
// mentorSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// const Mentor = mongoose.model("Mentor", mentorSchema);

// module.exports = Mentor;
