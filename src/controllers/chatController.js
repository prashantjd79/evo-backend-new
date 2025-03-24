
const Batch = require("../models/Batch");

const sendMessage = async (req, res) => {
    const studentId = req.student.id;
    const { batchId, message } = req.body;
  
    try {
      // ✅ Validate batch existence
      const batch = await Batch.findById(batchId);
      if (!batch) return res.status(404).json({ message: "Batch not found" });
  
      // ✅ Ensure student is part of the batch
      if (!batch.students.map(id => id.toString()).includes(studentId)) {
        return res.status(403).json({ message: "You are not part of this batch" });
      }
  
      // ✅ Save chat message
      batch.chatMessages.push({ sender: studentId, message });
      await batch.save();
  
      res.json({ message: "Message sent successfully", batch });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

  const getBatchChat = async (req, res) => {
    const studentId = req.student.id;
    const { batchId } = req.params;
  
    try {
      // ✅ Validate batch existence
      const batch = await Batch.findById(batchId).populate("chatMessages.sender", "name email");
      if (!batch) return res.status(404).json({ message: "Batch not found" });
  
      // ✅ Ensure student is part of the batch
      if (!batch.students.map(id => id.toString()).includes(studentId)) {
        return res.status(403).json({ message: "You are not part of this batch" });
      }
  
      res.json({ chat: batch.chatMessages });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  

module.exports = { sendMessage, getBatchChat };
