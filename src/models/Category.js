const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, unique: true },
    description: { type: String },
    photo: { type: String },
    wannaBeInterest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WannaBeInterest"
    } // store filename or relative path like "category/icon123.png"
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
