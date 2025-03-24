const express = require("express");
const { createAssignment,updateAssignment,deleteAssignment} = require("../controllers/assignmentController");
const { adminProtect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", adminProtect, createAssignment);
router.put("/assignment/:assignmentId", adminProtect, updateAssignment);
router.delete("/assignment/:assignmentId", adminProtect, deleteAssignment);
module.exports = router;
