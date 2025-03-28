import { sendIndividualEmails } from "../mail/resend.js";
import { Logger } from "../utils/logger.js";

/**
 * Simple test to verify email sending works without using AI
 */
async function simpleNoAITest() {
  try {
    Logger.section("SIMPLE NO-AI EMAIL SENDING TEST");

    // Create minimal test data with template variable replacement already done
    const testEmails = [
      {
        recipient: "yasser.dalali.personal@gmail.com",
        subject: "Test Email for MarketEdge - ECMP Platform",
        text: "Hello Yasser,\n\nThis is a test email for MarketEdge. Our email campaign platform can help with your digital marketing needs.\n\nBest regards,\nECMP Team",
        html: "<p>Hello Yasser,</p><p>This is a test email for <strong>MarketEdge</strong>. Our email campaign platform can help with your <strong>digital marketing</strong> needs.</p><p>Best regards,<br>ECMP Team</p>",
      },
      {
        recipient: "yassinemazhare@gmail.com",
        subject: "Test Email for TechNova - ECMP Platform",
        text: "Hello Yassine,\n\nThis is a test email for TechNova. Our email campaign platform can help with your software development needs.\n\nBest regards,\nECMP Team",
        html: "<p>Hello Yassine,</p><p>This is a test email for <strong>TechNova</strong>. Our email campaign platform can help with your <strong>software development</strong> needs.</p><p>Best regards,<br>ECMP Team</p>",
      },
    ];

    Logger.info(
      `Created test data with ${testEmails.length} pre-formatted emails`
    );
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
          Logger.success(`${i + 1}. SUCCESS: To ${email.recipient}`);
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
simpleNoAITest();
