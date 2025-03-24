const mongoose = require("mongoose");

const wannaBeInterestSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["Wanna Be", "Interest"],
    required: true,
  },
  name: { type: String, required: true, unique: true },
}, { timestamps: true });

const WannaBeInterest = mongoose.model("WannaBeInterest", wannaBeInterestSchema);

module.exports = WannaBeInterest;
