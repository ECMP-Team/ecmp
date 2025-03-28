import { sendIndividualEmails } from "../mail/resend.js";
import { Logger } from "../utils/logger.js";

/**
 * Simple test to verify email sending works
 */
async function simpleBatchTest() {
  try {
    Logger.section("SIMPLE EMAIL SENDING TEST");

    // Create minimal test data - just 2 emails
    const testEmails = [
      {
        recipient: "yasser.dalali.personal@gmail.com",
        subject: "Test Email 1 - ECMP Test",
        text: "This is a test email 1 from ECMP - testing individual email sending functionality.",
      },
      {
        recipient: "yassinemazhare@gmail.com",
        subject: "Test Email 2 - ECMP Test",
        text: "This is a test email 2 from ECMP - testing individual email sending functionality.",
      },
    ];

    Logger.info(`Created test data with ${testEmails.length} real emails`);
    Logger.warning("⚠️ THIS WILL SEND REAL EMAILS");
    Logger.warning("⚠️ Sending will begin in 3 seconds - Ctrl+C to cancel");

    // 3 second delay to allow cancellation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Send the emails
    Logger.section("Sending Process");
    Logger.info("Starting email send operation...");

    const results = await sendIndividualEmails(
      testEmails,
      "testing@resend.dev"
    );

    // Log results
    Logger.section("Results");
    Logger.success(`Successfully sent: ${results.successful} emails`);
    Logger.warning(`Failed to send: ${results.failed} emails`);

    // Log details
    if (results.details && results.details.length > 0) {
      Logger.section("Email Sending Details");

      results.details.forEach((email, i) => {
        if (email.status === "success") {
          Logger.success(
            `${i + 1}. SUCCESS: To ${email.recipient}, ID: ${email.id}`
          );
        } else {
          Logger.error(
            `${i + 1}. FAILED: To ${email.recipient}, Error: ${email.error}`
          );
        }
      });
    }
  } catch (error) {
    Logger.error(`Test failed: ${error.message}`);
    console.error(error);
  }
}

// Run the test
simpleBatchTest();
