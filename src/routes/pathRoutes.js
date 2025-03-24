const express = require("express");
const { createPath, assignWannaBeInterestToPath } = require("../controllers/pathController");
const {adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", adminProtect, createPath);
router.put("/assign-wanna-be-interest", adminProtect, assignWannaBeInterestToPath);

module.exports = router;
