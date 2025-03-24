const express = require("express");
const { registerPublisher, loginPublisher } = require("../controllers/publisherAuthController");

const router = express.Router();

router.post("/register", registerPublisher); // Publisher sign up
router.post("/login", loginPublisher); // Publisher login after approval

module.exports = router;
