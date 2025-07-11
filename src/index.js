const express = require("express");
const EmailService = require("./services/EmailService");
const { config } = require("dotenv");
config();
const app = express();
const emailService = new EmailService();
const PORT = process.env.PORT || 3000;

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



app.listen(PORT, () => {
  console.log(`Email service running at http://localhost:${PORT}`);
});
