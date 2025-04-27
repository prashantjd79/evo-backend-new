const Blog = require("../models/Blog");
const User = require("../models/User");
const slugify = require("slugify");
const createBlog = async (req, res) => {
  try {
    if (!req.publisher || !req.publisher.id) {
      return res.status(401).json({ message: "Unauthorized: Publisher ID missing" });
    }

    const publisher = await User.findById(req.publisher.id);
    if (!publisher || publisher.role !== "Publisher") {
      return res.status(403).json({ message: "Access denied: Invalid publisher" });
    }
    let generatedSlug = slugify(req.body.title, { lower: true, strict: true });

    // 🟢 Check if slug already exists
    const existingBlog = await Blog.findOne({ slug: generatedSlug });
    if (existingBlog) {
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      generatedSlug = `${generatedSlug}-${randomSuffix}`;
    }
    const blog = await Blog.create({
      title: req.body.title,
      slug: generatedSlug,
      content: req.body.content,
      tags: req.body.tags ? req.body.tags.split(",").map(tag => tag.trim()) : [],
      image: req.file?.filename || "",
      conclusion: req.body.conclusion,
      creator: req.publisher.id,
      status: "Pending"
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
    if (req.body.title && req.body.title !== blog.title) {
      let generatedSlug = slugify(req.body.title, { lower: true, strict: true });

      const existingBlogWithSlug = await Blog.findOne({ slug: generatedSlug, _id: { $ne: blog._id } });
      if (existingBlogWithSlug) {
        const randomSuffix = Math.floor(1000 + Math.random() * 9000);
        generatedSlug = `${generatedSlug}-${randomSuffix}`;
      }

      blog.slug = generatedSlug; // Update slug
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
const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id)
      .populate("category_id", "title") // optional if you want category info
      .lean();

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ blog });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({ message: "Failed to fetch blog" });
  }
};


module.exports = { createBlog ,updateBlog,deleteBlog,getBlogById};
