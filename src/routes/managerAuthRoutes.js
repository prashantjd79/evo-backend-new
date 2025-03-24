const express = require("express");
const { registerManager, loginManager } = require("../controllers/managerAuthController");

const router = express.Router();

router.post("/register", registerManager); // Manager sign up
router.post("/login", loginManager); // Manager login after approval

module.exports = router;
