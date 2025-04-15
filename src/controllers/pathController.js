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
const getPaths = async (req, res) => {
  try {
    const paths = await Path.find()
      .populate({
        path: "courses",
        select: "title _id"
      })
      .populate({
        path: "wannaBeInterest", // this is an array
        select: "title"
      });

    res.status(200).json({ paths });
  } catch (error) {
    console.error("Error fetching paths:", error);
    res.status(500).json({ message: "Failed to fetch paths" });
  }
};



const deletePath = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedPath = await Path.findByIdAndDelete(id);

    if (!deletedPath) {
      return res.status(404).json({ message: "Path not found" });
    }

    res.json({ message: "Path deleted successfully", deletedPath });
  } catch (error) {
    console.error("Error deleting path:", error);
    res.status(500).json({ message: "Failed to delete path" });
  }
};





const getPathById = async (req, res) => {
  try {
    const { id } = req.params;

    const path = await Path.findById(id)
      .populate({
        path: "courses",
        select: "title description", // optional: add photo, timing if needed
      })
      .populate({
        path: "wannaBeInterest",
        select: "title"
      });

    if (!path) return res.status(404).json({ message: "Path not found" });

    console.log("Fetched path raw data:", path);

    res.status(200).json({
      path: {
        _id: path._id,
        name: path.title,
        description: path.description,
        photo: path.photo,
        timing: path.timing,
        price: path.price,
        courses: path.courses.map(course => ({
          id: course._id,
          title: course.title,
          description: course.description
        })),
        wannaBeInterest: path.wannaBeInterest.map(i => i.title),
        createdAt: path.createdAt,
        updatedAt: path.updatedAt
      }
    });
  } catch (error) {
    console.error("Error in getPathById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};






module.exports = { createPath,deletePath, assignWannaBeInterestToPath ,getPaths,getPathById};
