const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, html }) => {
  if (!to) throw new Error("Recipient email (to) is missing!");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  return transporter.sendMail({
    from: `"GYM2P" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
