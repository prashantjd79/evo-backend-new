

// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true, trim: true },
//   email: { type: String, required: true, unique: true, trim: true },
//   password: { type: String, required: true },
  
//   role: {
//     type: String,
//     enum: ["Manager", "Mentor", "Publisher", "Course Creator", "Employer", "Creator", "Student"],
//     required: true,
//   },

//   isApproved: { type: Boolean, default: false }, // ✅ Admin Approval Required
//   status: { type: String, enum: ["Active", "Inactive", "Banned"], default: "Active" },

//   // ✅ Assigned Mentors for Managers (Only Managers have this)
//   assignedMentors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

//   // ✅ WannaBeInterest (Only for Students)
//   wannaBeInterest: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "WannaBeInterest", 
//     required: function () {
//       return this.role === "Student";
//     }
//   },

//   // ✅ Courses & Progress (Only for Students)
//   enrolledCourses: [
//     {
//       course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
//       completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
//       assignmentScore: { type: Number, default: 0 }, // Average Assignment Score
//       quizScore: { type: Number, default: 0 }, // Average Quiz Score
//     }
//   ],

//   // ✅ Expertise (Only for Mentors)
//   expertise: { type: String },

//   // ✅ Company Name (Only for Employers)
//   companyName: { type: String },

// }, { timestamps: true });

// const User = mongoose.model("User", userSchema);
// module.exports = User;



const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  username: { type: String, unique: true, sparse: true, trim: true },
  password: { type: String, required: true },

  role: {
    type: String,
    enum: ["Manager", "Mentor", "Publisher", "Course Creator", "Employer", "Creator", "Student"],
    required: true,
  },

  isApproved: { type: Boolean, default: false },
  status: { type: String, enum: ["Active", "Inactive", "Banned"], default: "Active" },
  banned: {
    type: Boolean,
    default: false,
  },
  
  // ✅ Manager-specific
  assignedMentors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // ✅ Student-specific
  wannaBeInterest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "WannaBeInterest",
    required: function () {
      return this.role === "Student";
    }
  },

  
  dob: { type: Date },
  contactNumber: { type: String },
  photo: { type: String }, // e.g. uploads/students/avatar.png
  guardianName: { type: String },
  address: { type: String },
  education: { type: String },
  preferredLanguages: [{ type: String }],
  experience: [{ type: String }],
  otp: String,
  otpExpires: Date,
  isVerified: { type: Boolean, default: false },
  


  enrolledCourses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
      assignmentScore: { type: Number, default: 0 },
      quizScore: { type: Number, default: 0 },
    }
  ],

  // ✅ Mentor-specific
  expertise: { type: String },
  bio: { type: String },
  workingMode: {
    type: String,
    enum: ["In-Office", "WFH"],
    default: "WFH"
  },

  // ✅ Employer-specific
  type: { type: String, enum: ["Company", "Brand", "Individual"] },
  industry: { type: String },
  companySize: { type: String },
  companyName: { type: String },

  // ✅ Employer-specific
  companyName: { type: String }

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
