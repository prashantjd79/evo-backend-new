const Assignment = require("../models/Assignment");

const Lesson = require("../models/Lesson");

const createAssignment = async (req, res) => {
  const { lessonId, title, description, attachmentUrl } = req.body;

  try {
    // Find the lesson where the assignment should be added
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Create an assignment object
    const newAssignment = {
      title,
      description,
      attachmentUrl,
    };

    // Push the assignment inside the lesson's assignments array
    lesson.assignments.push(newAssignment);
    await lesson.save(); // Save updated lesson

    res.status(201).json({ message: "Assignment added successfully", lesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const updateAssignment = async (req, res) => {
  const { assignmentId } = req.params;
  const { title, description, attachmentUrl } = req.body;

  try {
    const updatedAssignment = await Lesson.findOneAndUpdate(
      { "assignments._id": assignmentId }, 
      {
        $set: {
          "assignments.$.title": title,
          "assignments.$.description": description,
          "assignments.$.attachmentUrl": attachmentUrl
        }
      },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json({ message: "Assignment updated successfully", updatedAssignment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const deleteAssignment = async (req, res) => {
  const { assignmentId } = req.params;

  try {
    const updatedLesson = await Lesson.findOneAndUpdate(
      { "assignments._id": assignmentId },
      { $pull: { assignments: { _id: assignmentId } } },
      { new: true }
    );

    if (!updatedLesson) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports={createAssignment,updateAssignment,deleteAssignment}