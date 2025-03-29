import { Resend } from "resend";
import { RESEND_API_KEY } from "../config/config.js";

const resend = new Resend(RESEND_API_KEY);

// Function to send email to multiple recipients
async function sendBulkEmail({ recipients, subject, text, html }) {
  try {
    // Send email to multiple recipients with improved headers
    const info = await resend.emails.send({
      from: "Your Name <testing@resend.dev>", // Use a real name instead of just email
      to: recipients,
      subject: subject,
      text: text, // Plain text version is important for deliverability
      html: html,
      headers: {
        // Prevent threading in Gmail
        "X-Entity-Ref-ID": Date.now().toString(),
        // Add List-Unsubscribe header for better deliverability
        "List-Unsubscribe": "<https://yourdomain.com/unsubscribe>",
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        // Add custom headers to indicate this is a transactional email
        Precedence: "transactional",
        "X-Auto-Response-Suppress": "OOF, AutoReply",
        // Add custom message ID for better tracking
        "X-Message-ID": `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 15)}`,
      },
      tags: [
        {
          name: "category",
          value: "transactional",
        },
      ],
    });
    console.log("Emails sent successfully!");
    console.log("Message IDs:", info.id);
    return info;
  } catch (error) {
    console.error("Error sending emails:", error);
    throw error;
  }
}

/**
 * Sends individual emails to multiple recipients (each with different content)
 * @param {Array} emailList - Array of email objects, each with recipient, subject, text, html
 * @param {string} fromEmail - Sender email address
 * @returns {Object} Results of sending operations
 */
async function sendIndividualEmails(
  emailList,
  fromEmail = "testing@resend.dev"
) {
  console.log(`Sending ${emailList.length} individual emails`);

  const results = {
    successful: 0,
    failed: 0,
    details: [],
  };

  // Process emails in batches to avoid rate limits
  const batchSize = 5; // Adjust based on API limits

  for (let i = 0; i < emailList.length; i += batchSize) {
    const batch = emailList.slice(i, i + batchSize);
    console.log(
      `Processing batch ${Math.floor(i / batchSize) + 1} with ${
        batch.length
      } emails`
    );

    // Process each email in the batch
    for (const email of batch) {
      try {
        console.log(
          `Sending to: ${email.recipient}, Subject: ${email.subject.substring(
            0,
            30
          )}...`
        );

        const messageId = `${Date.now()}-${Math.random()
          .toString(36)
          .substring(2, 15)}`;

        const response = await resend.emails.send({
          from: fromEmail,
          to: email.recipient,
          subject: email.subject,
          text: email.text || undefined, // Always include plain text version
          html: email.html || undefined,
          headers: {
            "X-Entity-Ref-ID": messageId,
            "List-Unsubscribe": "<https://yourdomain.com/unsubscribe>",
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
            Precedence: "transactional",
            "X-Auto-Response-Suppress": "OOF, AutoReply",
            "X-Message-ID": messageId,
          },
          tags: [
            {
              name: "category",
              value: "transactional",
            },
          ],
        });

        const responseId = response?.id || "unknown";
        console.log(
          `Success: Email sent to ${email.recipient}, ID: ${responseId}`
        );

        results.successful++;
        results.details.push({
          recipient: email.recipient,
          status: "success",
          id: responseId,
        });
      } catch (error) {
        console.error(`Error sending to ${email.recipient}:`, error.message);

        results.failed++;
        results.details.push({
          recipient: email.recipient,
          status: "error",
          error: error.message,
        });
      }
    }

    // Increased delay between batches for better deliverability
    if (i + batchSize < emailList.length) {
      console.log(`Waiting 1 seconds before next batch...`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log(
    `Email sending complete: ${results.successful} successful, ${results.failed} failed`
  );
  return results;
}

export { sendBulkEmail, sendIndividualEmails };
export default sendBulkEmail;
