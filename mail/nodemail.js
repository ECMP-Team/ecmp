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

// Example usage
const emailList = [
    "yasser.dalali.personal@gmail.com",
  "tecaj63854@deenur.com",
  "yassinemazhare@gmail.com",
];

const example = {
  recipients: emailList,
  subject: "Test Subject",
  text: "This is a test email sent to multiple recipients.",
  html: "<h1>Hello!</h1><p>This is a test email sent to multiple recipients.</p>",
};

// Example of sending an email
sendBulkEmail(example)
  .then(() => console.log("Email sending process completed"))
  .catch((err) => console.error("Failed to send emails:", err));

export { sendBulkEmail };
