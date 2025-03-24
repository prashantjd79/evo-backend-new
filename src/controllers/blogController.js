const Blog = require("../models/Blog");
const User = require("../models/User");

const createBlog = async (req, res) => {
  try {
    if (!req.publisher || !req.publisher.id) {
      return res.status(401).json({ message: "Unauthorized: Publisher ID missing" });
    }

    // Ensure the publisher exists in the database
    const publisher = await User.findById(req.publisher.id);
    if (!publisher || publisher.role !== "Publisher") {
      return res.status(403).json({ message: "Access denied: Invalid publisher" });
    }

    // Create the blog strictly with the logged-in publisher's ID
    const blog = await Blog.create({
      title: req.body.title,
      content: req.body.content,
      creator: req.publisher.id, // ✅ Fetch from token, no external input
      status: "Pending",
    });

    res.status(201).json({ message: "Blog submitted for approval", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBlog = async (req, res) => {
  try {
    if (!req.publisher || !req.publisher.id) {
      return res.status(401).json({ message: "Unauthorized: Publisher ID missing" });
    }

    const blog = await Blog.findById(req.params.blogId);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Ensure the authenticated publisher owns this blog
    if (blog.creator.toString() !== req.publisher.id) {
      return res.status(403).json({ message: "Access denied: You can only update your own blogs" });
    }

    // Update blog details
    blog.title = req.body.title || blog.title;
    blog.content = req.body.content || blog.content;
    blog.status = "Pending"; // Reset status to Pending after update

    await blog.save();

    res.json({ message: "Blog updated successfully", blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteBlog = async (req, res) => {
  try {
    if (!req.publisher || !req.publisher.id) {
      return res.status(401).json({ message: "Unauthorized: Publisher ID missing" });
    }

    const blog = await Blog.findById(req.params.blogId);

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Ensure the authenticated publisher owns this blog
    if (blog.creator.toString() !== req.publisher.id) {
      return res.status(403).json({ message: "Access denied: You can only delete your own blogs" });
    }

    await blog.deleteOne();

    res.json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { createBlog ,updateBlog,deleteBlog};
