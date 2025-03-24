const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("../config/db");


dotenv.config();
connectDB();

const app = express();

app.use(express.json());
app.use("/api/admin", require("../routes/adminRoutes"));
app.use("/api/wanna-be-interest", require("../routes/wannaBeInterestRoutes"));

app.use("/api/categories", require("../routes/categoryRoutes"));
app.use("/api/subcategories", require("../routes/subcategoryRoutes"));
app.use("/api/courses", require("../routes/courseRoutes"));
app.use("/api/lessons", require("../routes/lessonRoutes"));
app.use("/api/quizzes", require("../routes/quizRoutes"));
app.use("/api/assignments", require("../routes/assignmentRoutes"));
app.use("/api/paths", require("../routes/pathRoutes"));
app.use("/api/batches", require("../routes/batchRoutes"));
app.use("/api/students", require("../routes/studentRoutes"));
app.use("/api/mentors", require("../routes/mentorRoutes"));
app.use("/api/blogs", require("../routes/blogRoutes"));
app.use("/api/promos", require("../routes/promoCodeRoutes"));
app.use("/api/jobs", require("../routes/jobRoutes"));
app.use("/api/tickets", require("../routes/ticketRoutes"));
app.use("/api/announcements", require("../routes/announcementRoutes"));
app.use("/api/publishers/auth", require("../routes/publisherAuthRoutes"));
app.use("/api/course-creators/auth", require("../routes/courseCreatorAuthRoutes"));
app.use("/api/managers/auth", require("../routes/managerAuthRoutes"));
app.use("/api/managers/stats", require("../routes/mentorStatsRoutes"));
app.use("/api/chat", require("../routes/chatRoutes"));
app.use("/api/mentor-bookings", require("../routes/mentorBookingRoutes"));
app.use("/api/reviews", require("../routes/reviewRoutes"));




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
