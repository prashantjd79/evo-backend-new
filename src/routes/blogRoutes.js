const express = require("express");
const { createBlog,updateBlog,deleteBlog,getBlogById,getBlogBySlug } = require("../controllers/blogController");
const { publisherProtect } = require("../middleware/authMiddleware");
const uploadBlogImage = require("../middleware/uploadBlogImage");
const router = express.Router();

router.post("/", publisherProtect, uploadBlogImage.single("image"), createBlog);
router.put("/:blogId", publisherProtect, updateBlog); 
router.delete("/:blogId", publisherProtect, deleteBlog);
router.get("/:id",publisherProtect, getBlogById);
router.get("/slug/:slug", getBlogBySlug);

module.exports = router;
