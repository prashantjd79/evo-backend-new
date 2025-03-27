const Path = require("../models/Path");
const Course = require("../models/Course");
const WannaBeInterest = require("../models/WannaBeInterest");

// const createPath = async (req, res) => {
//     const { name, description, courseIds, wannaBeInterestIds } = req.body;
  
//     try {
//       // Validate courseIds
//       const validCourses = await Course.find({ _id: { $in: courseIds } });
//       if (validCourses.length !== courseIds.length) {
//         return res.status(400).json({ message: "Some course IDs are invalid" });
//       }
  
//       // Validate wannaBeInterestIds
//       const validWannaBeInterests = await WannaBeInterest.find({ _id: { $in: wannaBeInterestIds } });
//       if (validWannaBeInterests.length !== wannaBeInterestIds.length) {
//         return res.status(400).json({ message: "Some WannaBeInterest IDs are invalid" });
//       }
  
//       // Create path only if all IDs exist
//       const path = await Path.create({
//         name,
//         description,
//         courses: courseIds,
//         wannaBeInterest: wannaBeInterestIds,
//       });
  
//       res.status(201).json({ message: "Path created successfully", path });
//     } catch (error) {
//       res.status(500).json({ message: error.message });
//     }
//   };



const createPath = async (req, res) => {
  try {
    const {
      title,
      description,
      timing,
      price,
      courseIds,
      wannaBeInterestIds
    } = req.body;

    // 🔁 Parse comma-separated values
    const parsedCourseIds = typeof courseIds === "string"
      ? courseIds.split(",").map(id => id.trim())
      : [];

    const parsedWannaBeIds = typeof wannaBeInterestIds === "string"
      ? wannaBeInterestIds.split(",").map(id => id.trim())
      : [];

    // ✅ Validate
    if (!title || !parsedCourseIds.length || !parsedWannaBeIds.length) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const validCourses = await Course.find({ _id: { $in: parsedCourseIds } });
    const validWannaBe = await WannaBeInterest.find({ _id: { $in: parsedWannaBeIds } });

    if (validCourses.length !== parsedCourseIds.length) {
      return res.status(400).json({ message: "Some course IDs are invalid" });
    }

    if (validWannaBe.length !== parsedWannaBeIds.length) {
      return res.status(400).json({ message: "Some WannaBeInterest IDs are invalid" });
    }

    const photo = req.file ? `path/${req.file.filename}` : null;

    const pathDoc = await Path.create({
      title,
      description,
      timing,
      price: Number(price),
      photo,
      courses: parsedCourseIds,
      wannaBeInterest: parsedWannaBeIds
    });

    res.status(201).json({ message: "Path created successfully", path: pathDoc });

  } catch (error) {
    console.error("Create Path Error:", error);
    res.status(500).json({ message: error.message });
  }
};


const assignWannaBeInterestToPath = async (req, res) => {
  const { pathId, wannaBeInterestIds } = req.body;

  try {
    const validWannaBe = await WannaBeInterest.find({ _id: { $in: wannaBeInterestIds } });
    if (validWannaBe.length !== wannaBeInterestIds.length) {
      return res.status(400).json({ message: "Some WannaBeInterest IDs are invalid" });
    }

    const updatedPath = await Path.findByIdAndUpdate(
      pathId,
      { $set: { wannaBeInterest: wannaBeInterestIds } },
      { new: true, runValidators: false }
    );

    if (!updatedPath) {
      return res.status(404).json({ message: "Path not found" });
    }

    res.status(200).json({ message: "WannaBeInterest assigned successfully", path: updatedPath });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createPath, assignWannaBeInterestToPath };
