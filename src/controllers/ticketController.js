const Ticket = require("../models/Ticket");

const createTicket = async (req, res) => {
  try {
    const { userId, subject, message } = req.body;

    const ticket = await Ticket.create({
      user: userId,
      subject,
      message,
      attachment: req.file ? req.file.path : null,
      status: "Open"
    });

    res.status(201).json({ message: "Ticket created successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin Responds to a Ticket
const respondToTicket = async (req, res) => {
  const { ticketId, response, status } = req.body; // Status: "In Progress" or "Resolved"

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) return res.status(404).json({ message: "Ticket not found" });

    ticket.adminResponse = response;
    ticket.status = status;
    await ticket.save();

    res.json({ message: "Response added successfully", ticket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get All Tickets (Filtered by Status)
const getAllTickets = async (req, res) => {
  const { status } = req.query; // Optional status filter

  try {
    let query = {};
    if (status) query.status = status;

    const tickets = await Ticket.find(query).populate("user", "name email");
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getUserTickets = async (req, res) => {
  const { userId } = req.params;

  try {
    const tickets = await Ticket.find({ user: userId });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createTicket, respondToTicket, getAllTickets, getUserTickets };
