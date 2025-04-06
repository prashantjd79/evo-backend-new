const express = require("express");
const { createTicket, respondToTicket, getAllTickets, getUserTickets } = require("../controllers/ticketController");
const { adminProtect } = require("../middleware/authMiddleware");
const uploadTicketFile = require("../middleware/uploadTicketFile");

const router = express.Router();

router.post("/", uploadTicketFile.single("file"), createTicket);

router.put("/respond", adminProtect, respondToTicket); // Admin responds to a ticket
router.get("/", adminProtect, getAllTickets); // Get all tickets (optional filter by status)
router.get("/:userId", getUserTickets); // Get tickets of a specific user

module.exports = router;
