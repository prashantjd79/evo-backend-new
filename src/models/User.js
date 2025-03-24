



// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: {
//     type: String,
//     enum: ["Manager", "Mentor", "Publisher", "Course Creator", "Employer", "Creator", "Student"],
//     required: true,
//   },
//   isApproved: { type: Boolean, default: false }, // ✅ Admin Approval Required
//   status: { type: String, enum: ["Active", "Inactive", "Banned"], default: "Active" },

//   // ✅ Assigned Mentors for Managers
//   assignedMentors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

//   // ✅ WannaBeInterest (Required only for Students)
//   wannaBeInterest: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: "WannaBeInterest", 
//     required: function() {
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
//       evoScore: { type: Number, default: 0 } // Evo Score (Calculated dynamically)
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
  password: { type: String, required: true },
  
  role: {
    type: String,
    enum: ["Manager", "Mentor", "Publisher", "Course Creator", "Employer", "Creator", "Student"],
    required: true,
  },

  isApproved: { type: Boolean, default: false }, // ✅ Admin Approval Required
  status: { type: String, enum: ["Active", "Inactive", "Banned"], default: "Active" },

  // ✅ Assigned Mentors for Managers (Only Managers have this)
  assignedMentors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  // ✅ WannaBeInterest (Only for Students)
  wannaBeInterest: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "WannaBeInterest", 
    required: function () {
      return this.role === "Student";
    }
  },

  // ✅ Courses & Progress (Only for Students)
  enrolledCourses: [
    {
      course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
      completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
      assignmentScore: { type: Number, default: 0 }, // Average Assignment Score
      quizScore: { type: Number, default: 0 }, // Average Quiz Score
    }
  ],

  // ✅ Expertise (Only for Mentors)
  expertise: { type: String },

  // ✅ Company Name (Only for Employers)
  companyName: { type: String },

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
