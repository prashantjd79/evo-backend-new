// const mongoose = require("mongoose");

// const ticketSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   subject: { type: String, required: true },
//   message: { type: String, required: true },
//   attachment: { type: String }, // Optional file
//   status: {
//     type: String,
//     enum: ["Open", "In Progress", "Resolved", "Closed"],
//     default: "Open"
//   }
  
// }, { timestamps: true });

// const Ticket = mongoose.model("Ticket", ticketSchema);
// module.exports = Ticket;


const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    attachment: {
      type: String, // Optional file
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    adminResponse: {
      type: String, // ✅ Single-line admin reply
    },
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
