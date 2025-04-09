const express = require("express");
const { createBlog,updateBlog,deleteBlog,getBlogById } = require("../controllers/blogController");
const { publisherProtect } = require("../middleware/authMiddleware");
const uploadBlogImage = require("../middleware/uploadBlogImage");
const router = express.Router();

router.post("/", publisherProtect, uploadBlogImage.single("image"), createBlog);
router.put("/:blogId", publisherProtect, updateBlog); // ✅ Update Blog
router.delete("/:blogId", publisherProtect, deleteBlog); // ✅ Delete Blog
router.get("/:id",publisherProtect, getBlogById);
module.exports = router;
