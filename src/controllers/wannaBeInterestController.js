const WannaBeInterest = require("../models/WannaBeInterest");

const createWannaBeInterest = async (req, res) => {
  const { description } = req.body;
  const title = req.body.title; // ✅ ensure it's explicitly pulled from req.body
  const image = req.file?.path;

  try {
    // Basic validation
    if (!title || !description || !image) {
      return res.status(400).json({ message: "Title, description, and image are required." });
    }

    // Check duplicate by title
    const exists = await WannaBeInterest.findOne({ title });
    if (exists) {
      return res.status(400).json({ message: "This entry already exists." });
    }

    const newEntry = await WannaBeInterest.create({
      title,
      description,
      image,
    });

    res.status(201).json({ message: "Wanna Be/Interest added successfully", newEntry });
  } catch (error) {
    console.error("❌ Error creating WannaBeInterest:", error);
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
