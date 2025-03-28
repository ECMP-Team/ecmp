import express from 'express';
import { sendBulkEmail, sendIndividualEmails } from "./mail/resend.js";
import writeMail from "./api/mailWriter.js";

const app = express();

// Add middleware to parse JSON
app.use(express.json({ limit: "10mb" }));

// Endpoint to send the same email to multiple recipients
app.post("/api/send-bulk", async (req, res) => {
  try {
    const { recipients, subject, text, html } = req.body;

    if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of recipient email addresses",
      });
    }

    if (!subject || (!text && !html)) {
      return res.status(400).json({
        success: false,
        message: "Please provide subject and either text or html content",
      });
    }

    const result = await sendBulkEmail({ recipients, subject, text, html });

    return res.json({
      success: true,
      message: "Emails sent successfully",
      result,
    });
  } catch (error) {
    console.error("Error in /api/send-bulk:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending emails",
      error: error.message,
    });
  }
});

// Endpoint to send individual emails with different content to each recipient
app.post("/api/send-individual", async (req, res) => {
  try {
    const { emails, fromEmail } = req.body;

    if (!emails || !Array.isArray(emails) || emails.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of email objects",
      });
    }

    // Validate each email
    const validationErrors = [];
    emails.forEach((email, index) => {
      if (!email.recipient) {
        validationErrors.push(`Email at index ${index} is missing recipient`);
      }
      if (!email.subject) {
        validationErrors.push(`Email at index ${index} is missing subject`);
      }
      if (!email.text && !email.html) {
        validationErrors.push(
          `Email at index ${index} is missing both text and html content`
        );
      }
    });

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation errors",
        errors: validationErrors,
      });
    }

    // Send individual emails
    const results = await sendIndividualEmails(
      emails,
      fromEmail || "testing@resend.dev"
    );

    return res.json({
      success: true,
      message: `Sent ${results.successful} emails, ${results.failed} failed`,
      results,
    });
  } catch (error) {
    console.error("Error in /api/send-individual:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending emails",
      error: error.message,
    });
  }
});

// Endpoint to generate AI email content and send individualized emails
app.post("/api/generate-and-send", async (req, res) => {
  try {
    const { clientData, fromEmail } = req.body;

    if (!clientData || !Array.isArray(clientData) || clientData.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of client data objects",
      });
    }

    // Use mailWriter to generate content for each client
    const emails = [];

    for (const client of clientData) {
      // TODO: Call writeMail with client data to generate email content
      // This is a placeholder - writeMail needs to be modified to accept client data
      const emailContent = await writeMail(client);

      emails.push({
        recipient: client.email,
        subject: emailContent.subject,
        text: emailContent.text,
        html: emailContent.html,
      });
    }

    // Send individual emails
    const results = await sendIndividualEmails(
      emails,
      fromEmail || "testing@resend.dev"
    );

    return res.json({
      success: true,
      message: `Generated and sent ${results.successful} emails, ${results.failed} failed`,
      results,
    });
  } catch (error) {
    console.error("Error in /api/generate-and-send:", error);
    return res.status(500).json({
      success: false,
      message: "Error generating or sending emails",
      error: error.message,
    });
  }
});

// Simple health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "UP",
    message: "ECMP API is running",
  });
});

app.listen(5500, () => {
  console.log("🟢 ECMP API running on: http://localhost:5500");
});