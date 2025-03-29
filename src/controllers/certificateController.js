// controllers/certificateController.js
const Certificate = require("../models/Certificate");
const User = require("../models/User");

const issueCertificate = async (req, res) => {
  const { studentId, courseId } = req.body;
  const file = req.file;

  if (!studentId || !courseId || !file) {
    return res.status(400).json({ message: "All fields (studentId, courseId, PDF file) are required." });
  }

  try {
    const studentExists = await User.findOne({ _id: studentId, role: "Student" });

    if (!studentExists) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ TEMPORARY FIX (Replace below ID with your actual admin User ID from database)
    const adminId = "65e987fc123a4540f28d6b3c"; 

    const newCertificate = await Certificate.create({
      student: studentId,
      course: courseId,
      fileUrl: `certificates/${file.filename}`,
      issuedBy: adminId,
    });

    res.status(201).json({
      message: "Certificate issued successfully.",
      certificate: {
        _id: newCertificate._id,
        studentId: newCertificate.student,
        courseId: newCertificate.course,
        fileUrl: newCertificate.fileUrl,
        issuedBy: newCertificate.issuedBy,
        createdAt: newCertificate.createdAt,
      }
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { issueCertificate };
