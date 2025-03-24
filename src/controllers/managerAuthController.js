const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
  };
  
  // ✅ Manager Sign Up
  const registerManager = async (req, res) => {
    const { name, email, password } = req.body;
  
    try {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "Email already registered" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const manager = await User.create({
        name,
        email,
        password: hashedPassword,
        role: "Manager",
        isApproved: false, // ✅ Requires Admin Approval
      });
  
      res.status(201).json({ message: "Registration successful. Waiting for admin approval.", manager });
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
