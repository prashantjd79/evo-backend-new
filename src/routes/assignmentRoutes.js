const express = require("express");
const { createAssignment,updateAssignment,deleteAssignment} = require("../controllers/assignmentController");
const { adminProtect } = require("../middleware/authMiddleware");
const uploadAssignment = require("../middleware/uploadAssignment");
const router = express.Router();

//router.post("/", adminProtect, createAssignment);
router.post("/", adminProtect, uploadAssignment.single("attachment"), createAssignment);

router.put("/assignment/:assignmentId", adminProtect, updateAssignment);
router.delete("/assignment/:assignmentId", adminProtect, deleteAssignment);
module.exports = router;
