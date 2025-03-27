const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
    photo: { type: String }, // store filename or relative path like "category/icon123.png"
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
