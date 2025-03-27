const express = require("express");
const { createPath, assignWannaBeInterestToPath } = require("../controllers/pathController");
const {adminProtect } = require("../middleware/authMiddleware");
const upload = require("../middleware/multer");
const multer = require('multer');
const router = express.Router();

const setPathUploadType = (req, res, next) => {
    req.uploadType = "path";
    next();
  };
  
  router.post(
    "/",
    adminProtect,
    setPathUploadType,
    upload.single("photo"),
    createPath
  );


// router.post("/", adminProtect, createPath);

router.put(
  "/assign-wanna-be-interest",
  adminProtect,
  assignWannaBeInterestToPath
);
module.exports = router;
