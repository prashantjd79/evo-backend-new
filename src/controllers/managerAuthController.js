const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
  };
  
  const registerManager = async (req, res) => {
    const {
      name,
      username,
      dob,
      email,
      password,
      contactNumber,
      about,
      address,
      education,
      workingMode
    } = req.body;
    console.log("📥 File received once:", req.file?.filename);
    try {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "Email already registered" });
  
      const existingUsername = await User.findOne({ username });
      if (existingUsername) return res.status(400).json({ message: "Username already taken" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const photo = req.file ? `managers/${req.file.filename}` : null;
  
      const manager = await User.create({
        name,
        username,
        dob,
        email,
        password: hashedPassword,
        contactNumber,
        bio: about,
        address,
        education,
        workingMode,
        photo,
        role: "Manager",
        isApproved: false,
      });
  
      res.status(201).json({
        message: "Registration successful. Waiting for admin approval.",
        manager: {
          _id: manager._id,
          name: manager.name,
          username: manager.username,
          email: manager.email,
          contactNumber: manager.contactNumber,
          workingMode: manager.workingMode,
          photo: manager.photo,
          isApproved: manager.isApproved,
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const loginManager = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const manager = await User.findOne({ email, role: "Manager" });
      if (!manager) return res.status(400).json({ message: "Manager not found" });
  
      if (manager.banned) {
        return res.status(403).json({ message: "Your account has been banned by the admin." });
      }
      

      if (!manager.isApproved) return res.status(403).json({ message: "Your account is pending approval by admin." });
  
      const isMatch = await bcrypt.compare(password, manager.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });
  
      res.json({
        _id: manager.id,
        name: manager.name,
        email: manager.email,
        role: manager.role, // ✅ Ensure role is included
        token: generateToken(manager.id, manager.role), // ✅ Include role in token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
 //

 const getAssignedMentors = async (req, res) => {
  try {
    const managerId = req.manager?.id; // Manager ID from middleware
    if (!managerId) {
      return res.status(403).json({ message: "Access denied. Managers only." });
    }

    const manager = await User.findById(managerId).populate("assignedMentors", "-password");
    if (!manager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    res.json({ assignedMentors: manager.assignedMentors });
  } catch (error) {
    console.error("Error fetching assigned mentors:", error);
    res.status(500).json({ message: "Failed to fetch assigned mentors" });
  }
};

const updateManagerProfile = async (req, res) => {
  try {
    const managerId = req.manager?.id;

    if (!managerId) {
      return res.status(401).json({ message: "Unauthorized: Manager not found" });
    }

    const updates = {
      name: req.body.name,
      username: req.body.username,
      dob: req.body.dob,
      email: req.body.email,
      contactNumber: req.body.contactNumber,
      about: req.body.about,
      address: req.body.address,
      education: req.body.education,
      workingMode: req.body.workingMode,
    };

    // ✅ Photo handling (form-data)
    if (req.file) {
      updates.photo = `managers/${req.file.filename}`;
    } else if (req.body.photo) {
      updates.photo = req.body.photo;
    }

    const updatedManager = await User.findByIdAndUpdate(managerId, updates, {
      new: true,
    }).select("-password");

    if (!updatedManager) {
      return res.status(404).json({ message: "Manager not found" });
    }

    res.status(200).json({
      message: "Manager profile updated successfully",
      manager: updatedManager,
    });
  } catch (error) {
    console.error("❌ Error updating manager profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { registerManager,getAssignedMentors,updateManagerProfile, loginManager };
