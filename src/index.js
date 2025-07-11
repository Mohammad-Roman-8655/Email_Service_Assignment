const express = require("express");
const EmailService = require("./services/EmailService");

const app = express();
const emailService = new EmailService();

app.use(express.json());

app.post("/send", async (req, res) => {
  const { id, email, subject, body } = req.body;

  try {
    await emailService.sendEmail(id, email, subject, body);
    res.status(200).json({ status: "Email sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log("🚀 Email service running at http://localhost:3000");
});
