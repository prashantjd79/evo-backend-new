const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    photo: { type: String },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    wannaBeInterest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "WannaBeInterest"
    }
  },
  { timestamps: true }
);

const Subcategory = mongoose.model("Subcategory", subcategorySchema);
module.exports = Subcategory;
