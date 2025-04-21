const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		time: { type: String },
		batchWeekType: {
			type: String,
			enum: ["Full Week", "Mon-Fri", "Weekend"],
			default: "Mon-Fri",
		},
		startDate: { type: Date },
		endDate: { type: Date },
		course: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Course",
			required: true,
		},
		students: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		mentor: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Mentor",
			default: null,
		},
		chatMessages: [
			{
				sender: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User", // applies for both student & mentor
					required: true,
				},
				senderType: {
					type: String,
					enum: ["student", "mentor"],
					required: false,
					default: "student",
				},
				message: { type: String, required: true },
				timestamp: { type: Date, default: Date.now },
			},
		],
		pinnedMessage: {
			sender: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
			senderType: {
				type: String,
				enum: ["student", "mentor"],
			},
			message: String,
			timestamp: Date,
		},
		scheduledSessions: [
			{
				date: { type: Date, required: true },
				time: { type: String }, // Add this
				link: { type: String, required: true },
				topic: { type: String },
				comment: { type: String },
				createdBy: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Mentor",
				},
			},
		],
	},
	{ timestamps: true }
);
const Batch = mongoose.model("Batch", batchSchema);
module.exports = Batch;