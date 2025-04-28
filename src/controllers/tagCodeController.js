const TagCode = require("../models/TagCode");

// Create TagCode
const createTagCode = async (req, res) => {
  try {
    const { title, code } = req.body;

    if (!title || !code) {
      return res.status(400).json({ message: "Title and code are required." });
    }

    const newTagCode = await TagCode.create({ title, code });

    res.status(201).json({ message: "TagCode created successfully.", tagCode: newTagCode });
  } catch (error) {
    console.error("❌ Create TagCode error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Update TagCode
const updateTagCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, code } = req.body;

    const tagCode = await TagCode.findById(id);

    if (!tagCode) {
      return res.status(404).json({ message: "TagCode not found." });
    }

    if (title) tagCode.title = title;
    if (code) tagCode.code = code;

    await tagCode.save();

    res.json({ message: "TagCode updated successfully.", tagCode });
  } catch (error) {
    console.error("❌ Update TagCode error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Delete TagCode
const deleteTagCode = async (req, res) => {
  try {
    const { id } = req.params;

    const tagCode = await TagCode.findById(id);

    if (!tagCode) {
      return res.status(404).json({ message: "TagCode not found." });
    }

    await tagCode.deleteOne();

    res.json({ message: "TagCode deleted successfully." });
  } catch (error) {
    console.error("❌ Delete TagCode error:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get All TagCodes
const getAllTagCodes = async (req, res) => {
  try {
    const tagCodes = await TagCode.find().sort({ createdAt: -1 });
    res.json(tagCodes);
  } catch (error) {
    console.error("❌ Get All TagCodes error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTagCode,
  updateTagCode,
  deleteTagCode,
  getAllTagCodes
};
