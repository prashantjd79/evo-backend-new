const WannaBeInterest = require("../models/WannaBeInterest");

const createWannaBeInterest = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !req.file) {
      return res.status(400).json({ message: "Title and image are required." });
    }

    // Check for existing title
    const exists = await WannaBeInterest.findOne({ title });
    if (exists) return res.status(400).json({ message: "This title already exists" });

    const newEntry = await WannaBeInterest.create({
      title,
      description,
      image: req.file.path, // multer stores the path
    });

    res.status(201).json({ message: "Wanna Be Interest created successfully", newEntry });
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
