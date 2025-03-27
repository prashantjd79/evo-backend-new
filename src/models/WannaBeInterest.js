const mongoose = require("mongoose");

const wannaBeInterestSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true, trim: true },
  description: { type: String },
  image: { type: String }, // path to uploaded image
}, { timestamps: true });

const WannaBeInterest = mongoose.model("WannaBeInterest", wannaBeInterestSchema);
module.exports = WannaBeInterest;
