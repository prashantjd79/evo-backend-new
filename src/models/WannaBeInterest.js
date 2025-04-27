const mongoose = require("mongoose");

const wannaBeInterestSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, unique: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
}, { timestamps: true });

const WannaBeInterest = mongoose.model("WannaBeInterest", wannaBeInterestSchema);
module.exports = WannaBeInterest;
