const express = require("express");
const { registerManager, loginManager } = require("../controllers/managerAuthController");
const uploadManagerPhoto = require("../middleware/uploadManagerPhoto");

const router = express.Router();

router.post("/signup", uploadManagerPhoto.single("photo"), registerManager);
router.post("/login", loginManager); // Manager login after approval

module.exports = router;
