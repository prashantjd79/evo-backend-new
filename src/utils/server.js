const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const cors=require("cors");
const certificateRoutes = require("../routes/certificateRoutes");
const http = require("http");
const { Server } = require("socket.io");



dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app)

const onlineUsers = {}; // key = userId, value = { socketId, batchId, name, role }
// SOCKET.IO SETUP
const io = new Server(server, {
	cors: {
		origin: "*", // replace with frontend domain if needed
		methods: ["GET", "POST"],
	},
});

io.on("connection", (socket) => {
	console.log("🟢 New client connected:", socket.id);

	socket.on("joinBatch", (batchId) => {
		socket.join(batchId);
		console.log(`User ${socket.id} joined batch ${batchId}`);
	});

	// NEW: User comes online with details
	socket.on("userOnline", ({ userId, name, role, batchId }) => {
		onlineUsers[userId] = {
			socketId: socket.id,
			batchId,
			name,
			role,
		};

		socket.join(batchId); // just in case

		// Broadcast updated online users in batch
		io.to(batchId).emit("onlineUsers", getOnlineUsers(batchId));
	});

	socket.on("sendMessage", ({ batchId, messageData }) => {
		io.to(batchId).emit("receiveMessage", messageData);
	});

	socket.on("disconnect", () => {
		let disconnectedUserId = null;

		// Find userId by socket
		for (let userId in onlineUsers) {
			if (onlineUsers[userId].socketId === socket.id) {
				disconnectedUserId = userId;
				break;
			}
		}

		if (disconnectedUserId) {
			const batchId = onlineUsers[disconnectedUserId].batchId;
			delete onlineUsers[disconnectedUserId];
			console.log(`🔴 User ${disconnectedUserId} disconnected`);

			// Notify users in the same batch
			io.to(batchId).emit("onlineUsers", getOnlineUsers(batchId));
		}
	});
});

function getOnlineUsers(batchId) {
	return Object.entries(onlineUsers)
		.filter(([, val]) => val.batchId === batchId)
		.map(([userId, data]) => ({
			userId,
			name: data.name,
			role: data.role,
		}));
}

// Make `io` accessible from controllers if needed
app.set("io", io);



app.use(express.json());
app.use(cors());
app.use("/api/admin", require("../routes/adminRoutes"));
app.use("/api/wanna-be-interest", require("../routes/wannaBeInterestRoutes"));
app.use("/api/certificates", require("../routes/certificateRoutes"));
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
app.use("/uploads", express.static("uploads"));



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
