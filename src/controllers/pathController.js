const Path = require("../models/Path");
const Course = require("../models/Course");
const WannaBeInterest = require("../models/WannaBeInterest");

const createPath = async (req, res) => {
    const { name, description, courseIds, wannaBeInterestIds } = req.body;
  
    try {
      // Validate courseIds
      const validCourses = await Course.find({ _id: { $in: courseIds } });
      if (validCourses.length !== courseIds.length) {
        return res.status(400).json({ message: "Some course IDs are invalid" });
      }
  
      // Validate wannaBeInterestIds
      const validWannaBeInterests = await WannaBeInterest.find({ _id: { $in: wannaBeInterestIds } });
      if (validWannaBeInterests.length !== wannaBeInterestIds.length) {
        return res.status(400).json({ message: "Some WannaBeInterest IDs are invalid" });
      }
  
      // Create path only if all IDs exist
      const path = await Path.create({
        name,
        description,
        courses: courseIds,
        wannaBeInterest: wannaBeInterestIds,
      });
  
      res.status(201).json({ message: "Path created successfully", path });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const assignWannaBeInterestToPath = async (req, res) => {
    const { pathId, wannaBeInterestIds } = req.body; // Expect an array of WannaBeInterest IDs
  
    try {
      // Validate courseId
      const path = await Path.findById(pathId);
      if (!path) {
        return res.status(404).json({ message: "Path not found" });
      }
  
      // Validate each wannaBeInterestId
      const validWannaBeInterests = await WannaBeInterest.find({ _id: { $in: wannaBeInterestIds } });
  
      // If some IDs are invalid, return an error
      if (validWannaBeInterests.length !== wannaBeInterestIds.length) {
        return res.status(400).json({ message: "Some WannaBeInterest IDs are invalid" });
      }
  
      // Assign validated WannaBeInterest IDs to the course
      path.wannaBeInterest = wannaBeInterestIds;
      await path.save();
  
      res.json({ message: "WannaBeInterest assigned successfully", path });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

module.exports = { createPath, assignWannaBeInterestToPath };
