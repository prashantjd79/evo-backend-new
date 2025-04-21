const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Blog = require("../models/Blog");

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
  
      if (publisher.banned) {
        return res.status(403).json({ message: "Your account has been banned by the admin." });
      }
      

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
  const getMyBlogs = async (req, res) => {
    try {
      const publisherId = req.publisher?.id;
  console.log(publisherId)
      if (!publisherId) {
        return res.status(403).json({ message: "Access denied. Publishers only." });
      }
  
      const blogs = await Blog.find({ creator: publisherId }).sort({ createdAt: -1 });
      res.json({ blogs });
    } catch (error) {
      console.error("Error fetching publisher blogs:", error);
      res.status(500).json({ message: "Failed to fetch blogs" });
    }
  };


  const updatePublisherProfile = async (req, res) => {
    try {
      const publisherId = req.publisher?.id;
  
      if (!publisherId) {
        return res.status(401).json({ message: "Unauthorized: Publisher not found" });
      }
  
      const updates = {
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        dob: req.body.dob,
        contactNumber: req.body.contactNumber,
        address: req.body.address,
        workingMode: req.body.workingMode,
        education: req.body.education,
        about: req.body.about,
      };
  
      // ✅ Handle photo update (form-data)
      if (req.file) {
        updates.photo = `publishers/${req.file.filename}`;
      } else if (req.body.photo) {
        updates.photo = req.body.photo;
      }
  
      const updatedPublisher = await User.findByIdAndUpdate(publisherId, updates, {
        new: true,
      }).select("-password");
  
      if (!updatedPublisher) {
        return res.status(404).json({ message: "Publisher not found" });
      }
  
      res.status(200).json({
        message: "Publisher profile updated successfully",
        publisher: updatedPublisher,
      });
    } catch (error) {
      console.error("❌ Error updating publisher profile:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };

module.exports = { registerPublisher, loginPublisher,getMyBlogs,updatePublisherProfile};
