const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure folder exists
const ticketFolder = "uploads/tickets";
if (!fs.existsSync(ticketFolder)) {
  fs.mkdirSync(ticketFolder, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, ticketFolder);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}${path.extname(file.originalname)}`);
  }
});

const uploadTicketFile = multer({ storage });

module.exports = uploadTicketFile;
