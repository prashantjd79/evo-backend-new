const mongoose = require("mongoose");

const tagCodeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    code: { type: String, required: true },
  },
  { timestamps: true }
);

const TagCode = mongoose.model("TagCode", tagCodeSchema);

module.exports = TagCode;
