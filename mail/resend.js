import { Resend } from "resend";
import { RESEND_API_KEY } from "../config/config.js";

const resend = new Resend(RESEND_API_KEY);

// Function to send email to multiple recipients
async function sendBulkEmail({ recipients, subject, text, html }) {
  try {
    // Send email to multiple recipients
    const info = await resend.emails.send({
      from: "testing@resend.dev",
      to: recipients,
      subject: subject,
      text: text,
      html: html,
    });
    console.log("Emails sent successfully!");
    console.log("Message IDs:", info.id);
    return info;
  } catch (error) {
    console.error("Error sending emails:", error);
    throw error;
  }
}

export default sendBulkEmail

