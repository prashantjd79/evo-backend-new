const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Creator who submitted the blog
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }, // Approval status
  publishedAt: { type: Date }, // Timestamp for approval
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
