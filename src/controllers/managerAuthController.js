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
  

module.exports = { registerManager, loginManager };
