const Batch = require("../models/Batch");
const Mentor = require("../models/Mentor"); // Adjust path as needed
// ====================== STUDENT =======================
const sendMessage = async (req, res) => {
	const studentId = req.user._id;
	const { batchId, message } = req.body;

	try {
		const batch = await Batch.findById(batchId);
		if (!batch) return res.status(404).json({ message: "Batch not found" });

		// Ensure student is part of the batch
		if (
			!batch.students.map((id) => id.toString()).includes(studentId.toString())
		) {
			return res
				.status(403)
				.json({ message: "You are not part of this batch" });
		}

		batch.chatMessages.push({
			sender: studentId,
			message,
			senderType: "student",
		});
		await batch.save();

		res.json({ message: "Message sent successfully", batch });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getBatchChat = async (req, res) => {
	const studentId = req.user?._id;
	const { batchId } = req.params;

	try {
		const batch = await Batch.findById(batchId).populate(
			"chatMessages.sender",
			"name email"
		);
		if (!batch) return res.status(404).json({ message: "Batch not found" });

		if (
			!batch.students.map((id) => id.toString()).includes(studentId.toString())
		) {
			return res
				.status(403)
				.json({ message: "You are not part of this batch" });
		}

		res.json({ chat: batch.chatMessages });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

// ====================== MENTOR =======================
const sendMessageMentor = async (req, res) => {
	const mentorId = req.mentor?.id;
	const { batchId, message } = req.body;

	try {
		const batch = await Batch.findById(batchId);
		if (!batch) return res.status(404).json({ message: "Batch not found" });

		if (batch.mentor?.toString() !== mentorId.toString()) {
			return res
				.status(403)
				.json({ message: "You are not the mentor of this batch" });
		}

		const messagePayload = {
			sender: mentorId,
			message,
			senderType: "mentor",
			timestamp: new Date(),
		};

		batch.chatMessages.push(messagePayload);
		await batch.save();

		// ✅ EMIT TO SOCKET ROOM FOR REALTIME
		const io = req.app.get("io"); // assuming you stored io on app instance
		io.to(batchId).emit("receiveMessage", {
			...messagePayload,
			sender: { _id: mentorId, name: req.mentor.name }, // send populated
		});

		res.json({ message: "Message sent successfully", batch });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getBatchChatMentor = async (req, res) => {
	const mentorId = req.mentor?.id;
	const { batchId } = req.params;

	try {
		const batch = await Batch.findById(batchId).populate(
			"chatMessages.sender",
			"name email"
		);
		if (!batch) return res.status(404).json({ message: "Batch not found" });

		if (batch.mentor?.toString() !== mentorId.toString()) {
			return res
				.status(403)
				.json({ message: "You are not the mentor of this batch" });
		}

		res.json({ chat: batch.chatMessages });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const pinMessage = async (req, res) => {
	const mentorId = req.mentor?.id;
	const { batchId, messageId } = req.body;

	try {
		const batch = await Batch.findById(batchId);
		if (!batch) return res.status(404).json({ message: "Batch not found" });

		if (batch.mentor?.toString() !== mentorId.toString()) {
			return res.status(403).json({ message: "Not authorized" });
		}

		const messageToPin = batch.chatMessages.id(messageId);
		if (!messageToPin)
			return res.status(404).json({ message: "Message not found" });

		batch.pinnedMessage = {
			sender: messageToPin.sender,
			senderType: messageToPin.senderType,
			message: messageToPin.message,
			timestamp: messageToPin.timestamp,
		};

		await batch.save();

		const io = req.app.get("io");
		io.to(batchId).emit("pinnedMessageUpdated", batch.pinnedMessage);

		res.json({ pinnedMessage: batch.pinnedMessage });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const scheduleSession = async (req, res) => {
	const { batchId, link, topic, comment, time } = req.body;

	const mentorId = req.mentor.id;

	try {
		const batch = await Batch.findById(batchId);
		if (!batch) return res.status(404).json({ message: "Batch not found" });

		if (batch.mentor.toString() !== mentorId) {
			return res.status(403).json({ message: "Not authorized" });
		}

		const today = new Date();
		// const day = today.toLocaleString("en-US", { weekday: "short" }); // e.g., "Mon"

		// const allowedDays = {
		// 	"Mon-Fri": ["Mon", "Tue", "Wed", "Thu", "Fri"],
		// 	Weekend: ["Sat", "Sun"],
		// 	"Full Week": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		// };

		// const validDays = allowedDays[batch.batchWeekType || "Mon-Fri"];

		// if (!validDays.includes(day)) {
		// 	return res.status(400).json({
		// 		message: `Cannot schedule on ${day} for ${batch.batchWeekType}`,
		// 	});
		// }

		const alreadyScheduled = batch.scheduledSessions?.some(
			(session) =>
				new Date(session.date).toDateString() === today.toDateString()
		);
		if (alreadyScheduled) {
			return res
				.status(400)
				.json({ message: "Session already scheduled for today" });
		}

		const newSession = {
			date: today,
			link,
			topic,
			comment,
			time, // ✅ Include time
			createdBy: mentorId,
		};

		batch.scheduledSessions.push(newSession);
		await batch.save();

		const io = req.app.get("io");
		io.to(batchId).emit("newScheduledSession", newSession); // optional realtime update

		res.json({ message: "Session scheduled", session: newSession });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const updateScheduledSession = async (req, res) => {
	const { batchId, sessionId, link, topic, comment, time } = req.body;
	const mentorId = req.mentor.id;

	try {
		const batch = await Batch.findById(batchId);
		if (!batch) return res.status(404).json({ message: "Batch not found" });

		if (batch.mentor.toString() !== mentorId)
			return res.status(403).json({ message: "Not authorized" });

		const session = batch.scheduledSessions.id(sessionId);
		if (!session)
			return res.status(404).json({ message: "Scheduled session not found" });

		session.link = link;
		session.topic = topic;
		session.comment = comment;
		session.time = time;

		await batch.save();

		const io = req.app.get("io");
		io.to(batchId).emit("updatedScheduledSession", session);

		res.json({ message: "Session updated", session });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
const cancelScheduledSession = async (req, res) => {
	const { batchId, sessionId } = req.params;
	const mentorId = req.mentor.id;

	try {
		const batch = await Batch.findById(batchId);
		console.log(batch);

		if (!batch) return res.status(404).json({ message: "Batch not found" });

		if (batch.mentor.toString() !== mentorId)
			return res.status(403).json({ message: "Not authorized" });

		batch.scheduledSessions = batch.scheduledSessions.filter(
			(session) => session._id.toString() !== sessionId
		);

		await batch.save();

		const io = req.app.get("io");
		io.to(batchId).emit("cancelledScheduledSession", sessionId);

		res.json({ message: "Session cancelled" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

const getStudentUpcomingSessions = async (req, res) => {
	const studentId = req.user._id;

	try {
		const batches = await Batch.find({ students: studentId });

		const upcomingSessions = [];

		for (const batch of batches) {
			const sessions = batch.scheduledSessions;

			if (Array.isArray(sessions)) {
				sessions.forEach((session) => {
					upcomingSessions.push({
						batchId: batch?._id,
						batchName: batch?.name || "Unnamed Batch",
						courseTitle: batch?.course?.title || "Untitled Course",
						mentor: batch.mentor || "Unknown Mentor",
						date: session?.date || null,
						time: session?.time || "Not specified",
						link: session?.link || "#",
						topic: session?.topic || "No topic provided",
						comment: session?.comment || "",
					});
				});
			}
		}

		upcomingSessions.sort((a, b) => {
			const dateA = new Date(`${a.date}T${a.time || "00:00"}`);
			const dateB = new Date(`${b.date}T${b.time || "00:00"}`);
			return dateA.getTime() - dateB.getTime();
		});

		res.json({ upcomingSessions });
	} catch (error) {
		console.error("Error fetching upcoming sessions:", error.message);
		res.status(500).json({ message: "Failed to fetch upcoming sessions" });
	}
};
module.exports = {
	sendMessage,
	getBatchChat,
	sendMessageMentor,
	getBatchChatMentor,
	pinMessage,
	scheduleSession,
	updateScheduledSession,
	cancelScheduledSession,
	getStudentUpcomingSessions,
};