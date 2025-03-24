// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const studentSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   wannaBeInterest: { type: mongoose.Schema.Types.ObjectId, ref: "WannaBeInterest", required: true }, // Single reference
//   purchasedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }], // Courses purchased
//   purchasedPaths: [{ type: mongoose.Schema.Types.ObjectId, ref: "Path" }], // Paths purchased
// }, { timestamps: true });

// // Hash password before saving
// studentSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) return next();
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// const Student = mongoose.model("Student", studentSchema);

// module.exports = Student;
