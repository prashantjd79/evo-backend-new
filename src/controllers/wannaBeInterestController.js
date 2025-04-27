const WannaBeInterest = require("../models/WannaBeInterest");
const slugify = require("slugify");





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

    let generatedSlug = slugify(title, { lower: true, strict: true });

    // 🟢 Check if slug already exists
    const existingSlug = await WannaBeInterest.findOne({ slug: generatedSlug });
    if (existingSlug) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      generatedSlug = `${generatedSlug}-${randomSuffix}`;
    }


    const newEntry = await WannaBeInterest.create({
      title,
      description,
      slug: generatedSlug,
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

const updateWannaBeInterest = async (req, res) => {
  try {
    const wannaBeId = req.params.id;
    const { title, description } = req.body;
    const image = req.file?.path;

    const wannaBe = await WannaBeInterest.findById(wannaBeId);
    if (!wannaBe) return res.status(404).json({ message: "Wanna Be/Interest not found" });

    // Update title & slug
    if (title && title !== wannaBe.title) {
      let generatedSlug = slugify(title, { lower: true, strict: true });

      const existingWannaBe = await WannaBeInterest.findOne({ slug: generatedSlug, _id: { $ne: wannaBeId } });
      if (existingWannaBe) {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        generatedSlug = `${generatedSlug}-${randomSuffix}`;
      }

      wannaBe.title = title;
      wannaBe.slug = generatedSlug;
    }

    if (description) wannaBe.description = description;
    if (image) wannaBe.image = image;

    await wannaBe.save();

    res.json({ message: "Wanna Be/Interest updated successfully", wannaBe });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createWannaBeInterest,updateWannaBeInterest, getAllWannaBeInterest, deleteWannaBeInterest };
