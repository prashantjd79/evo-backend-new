const express = require("express");
const { createBlog,updateBlog,deleteBlog } = require("../controllers/blogController");
const { publisherProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", publisherProtect, createBlog); // Publisher submits a blog
router.put("/:blogId", publisherProtect, updateBlog); // ✅ Update Blog
router.delete("/:blogId", publisherProtect, deleteBlog); // ✅ Delete Blog
module.exports = router;
