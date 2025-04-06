const express = require("express");
const { registerPublisher, loginPublisher,getMyBlogs } = require("../controllers/publisherAuthController");
const uploadPublisherPhoto = require("../middleware/uploadPublisherPhoto");
const { publisherProtect } = require("../middleware/authMiddleware");
const router = express.Router();


router.post("/signup", uploadPublisherPhoto.single("photo"), registerPublisher)
router.post("/login", loginPublisher); // Publisher login after approval
router.get("/my-blogs", publisherProtect, getMyBlogs);
module.exports = router;
