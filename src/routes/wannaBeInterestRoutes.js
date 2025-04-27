const express = require("express");
const { createWannaBeInterest,updateWannaBeInterest, getAllWannaBeInterest, deleteWannaBeInterest,getWannaBeInterestBySlug } = require("../controllers/wannaBeInterestController");
const { adminProtect} = require("../middleware/authMiddleware");
const uploadWannaBePhoto = require("../middleware/uploadWannaBePhoto");
const router = express.Router();

router.post("/", adminProtect, uploadWannaBePhoto.single("image"), createWannaBeInterest);
router.put("/update/:id", adminProtect, uploadWannaBePhoto.single("image"), updateWannaBeInterest);
router.get("/", getAllWannaBeInterest);
router.delete("/:id", adminProtect, deleteWannaBeInterest);
router.get("/slug/:slug", getWannaBeInterestBySlug);

module.exports = router;
