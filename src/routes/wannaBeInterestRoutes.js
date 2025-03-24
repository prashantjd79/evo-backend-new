const express = require("express");
const { createWannaBeInterest, getAllWannaBeInterest, deleteWannaBeInterest } = require("../controllers/wannaBeInterestController");
const { adminProtect} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", adminProtect, createWannaBeInterest);
router.get("/", adminProtect, getAllWannaBeInterest);
router.delete("/:id", adminProtect, deleteWannaBeInterest);

module.exports = router;
