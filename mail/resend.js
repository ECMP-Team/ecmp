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

/**
 * Sends individual emails to multiple recipients (each with different content)
 * @param {Array} emailList - Array of email objects, each with recipient, subject, text, html
 * @param {string} fromEmail - Sender email address
 * @returns {Object} Results of sending operations
 */
async function sendIndividualEmails(emailList, fromEmail = "testing@resend.dev") {
  console.log(`Sending ${emailList.length} individual emails`);
  
  const results = {
    successful: 0,
    failed: 0,
    details: []
  };
  
  // Process emails in batches to avoid rate limits
  const batchSize = 5;  // Adjust based on API limits
  
  for (let i = 0; i < emailList.length; i += batchSize) {
    const batch = emailList.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i/batchSize) + 1} with ${batch.length} emails`);
    
    // Process each email in the batch
    for (const email of batch) {
      try {
        // Log each email being sent
        console.log(`Sending to: ${email.recipient}, Subject: ${email.subject.substring(0, 30)}...`);
        
        const response = await resend.emails.send({
          from: fromEmail,
          to: email.recipient,
          subject: email.subject,
          text: email.text || undefined,
          html: email.html || undefined,
        });
        
        const messageId = response?.id || 'unknown';
        console.log(`Success: Email sent to ${email.recipient}, ID: ${messageId}`);
        
        results.successful++;
        results.details.push({
          recipient: email.recipient,
          status: "success",
          id: messageId
        });
      } catch (error) {
        console.error(`Error sending to ${email.recipient}:`, error.message);
        
        results.failed++;
        results.details.push({
          recipient: email.recipient,
          status: "error",
          error: error.message
        });
      }
    }
    
    // Small delay between batches to avoid rate limits
    if (i + batchSize < emailList.length) {
      console.log(`Waiting 1 second before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`Email sending complete: ${results.successful} successful, ${results.failed} failed`);
  return results;
}

export { sendBulkEmail, sendIndividualEmails };
export default sendBulkEmail;

