const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
// Create a new Lesson under a Course
const createLesson = async (req, res) => {
    const { courseId, title, content, videoUrl, resources } = req.body;
  
    try {
      // Check if courseId is valid
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      // Create lesson only if courseId is valid
      const lesson = await Lesson.create({
        course: courseId,
        title,
        content,
        videoUrl,
        resources,
      });
  
      res.status(201).json({ message: "Lesson created successfully", lesson });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  const getLessonsByCourse = async (req, res) => {
    const { courseId } = req.params;
  
    try {
      // Check if courseId exists
      const course = await Course.findById(courseId);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
  
      // Fetch lessons for this course
      const lessons = await Lesson.find({ course: courseId });
  
      res.json(lessons);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
// Delete a Lesson
const deleteLesson = async (req, res) => {
  const { lessonId } = req.params;

  try {
    const deletedLesson = await Lesson.findByIdAndDelete(lessonId);
    if (!deletedLesson) return res.status(404).json({ message: "Lesson not found" });

    res.json({ message: "Lesson deleted successfully", deletedLesson });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createLesson, getLessonsByCourse, deleteLesson };
