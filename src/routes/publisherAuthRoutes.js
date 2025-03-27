const express = require("express");
const { registerPublisher, loginPublisher } = require("../controllers/publisherAuthController");
const uploadPublisherPhoto = require("../middleware/uploadPublisherPhoto");
const router = express.Router();


router.post("/signup", uploadPublisherPhoto.single("photo"), registerPublisher)
router.post("/login", loginPublisher); // Publisher login after approval

module.exports = router;
