const WannaBeInterest = require("../models/WannaBeInterest");

// Create a new "Wanna Be" or "Interest"
const createWannaBeInterest = async (req, res) => {
  const { type, name } = req.body;

  try {
    // Check if the name already exists
    const exists = await WannaBeInterest.findOne({ name });
    if (exists) return res.status(400).json({ message: "This entry already exists" });

    const newEntry = await WannaBeInterest.create({ type, name });
    res.status(201).json({ message: `${type} added successfully`, newEntry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all "Wanna Be" and "Interests"
const getAllWannaBeInterest = async (req, res) => {
  try {
    const list = await WannaBeInterest.find();
    res.json(list);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a "Wanna Be" or "Interest"
const deleteWannaBeInterest = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEntry = await WannaBeInterest.findByIdAndDelete(id);
    if (!deletedEntry) return res.status(404).json({ message: "Entry not found" });

    res.json({ message: "Entry deleted successfully", deletedEntry });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createWannaBeInterest, getAllWannaBeInterest, deleteWannaBeInterest };
