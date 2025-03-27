const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
  };
  

  const registerPublisher = async (req, res) => {
    const {
      name,
      username,
      email,
      password,
      dob,
      contactNumber,
      address,
      workingMode,
      education,
      about,
    } = req.body;
  
    try {
      const exists = await User.findOne({ email });
      if (exists) return res.status(400).json({ message: "Email already registered" });
  
      const hashedPassword = await bcrypt.hash(password, 10);
      const publisher = await User.create({
        name,
        username,
        email,
        password: hashedPassword,
        role: "Publisher",
        isApproved: false,
        dob,
        contactNumber,
        address,
        workingMode,
        education,
        bio: about,
        photo: req.file?.path || "", // Uploaded photo
      });
  
      res.status(201).json({
        message: "Publisher registered successfully. Awaiting admin approval.",
        publisher,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
const loginPublisher = async (req, res) => {
    const { email, password } = req.body;
  
    try {
      const publisher = await User.findOne({ email, role: "Publisher" });
      if (!publisher) return res.status(400).json({ message: "Publisher not found" });
  
      if (!publisher.isApproved) return res.status(403).json({ message: "Your account is pending approval by admin." });
  
      const isMatch = await bcrypt.compare(password, publisher.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });
  
      res.json({
        _id: publisher.id,
        name: publisher.name,
        email: publisher.email,
        role: publisher.role,
        token: generateToken(publisher.id, publisher.role) // ✅ Ensure role is in token
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

module.exports = { registerPublisher, loginPublisher };
