const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_USER, // send test email to yourself
  subject: "SMTP Test ✅",
  text: "This is a test message sent from Node.js using Gmail SMTP.",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("❌ Failed:", error);
  } else {
    console.log("✅ Email sent successfully:", info.response);
  }
});
