// utils/email.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOtpEmail = (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your Email - OTP",
    text: `Your OTP is: ${otp}. It expires in 10 minutes.`,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };
