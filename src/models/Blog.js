const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  content: { type: String, required: true },
  // category_id: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Category", // Make sure this matches your actual Category model name
  //   required: true
  // },
  
  tags: [{ type: String }],
  image: { type: String }, // e.g. "uploads/blogs/xyz.jpg"
  conclusion: { type: String }, // Short summary
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending"
  },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
