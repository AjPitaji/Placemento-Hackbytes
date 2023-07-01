const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("contact");
});

const nodemailer = require("nodemailer");
router.post("/", (req, res) => {
  var { name, email, message } = req.body;

  // Set up your email transporter here
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  message = message + "\n\nFrom: " + name + "\nEmail: " + email;
  // Set up your email message options here
  const mailOptions = {
    from: email,
    to: "aj03jha@gmail.com",
    subject: `New message from ${name}`,
    text: message,
  };

  // Send the email using the transporter and mailOptions
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send("Error: Something went wrong");
    } else {
      console.log(`Email sent: ${info.response}`);
      res.redirect("/contact");
    }
  });
});

module.exports = router;
