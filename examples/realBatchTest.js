import { sendIndividualEmails } from "../mail/resend.js";
import { Logger } from "../utils/logger.js";

/**
 * Real integration test for batch sending functionality
 * This actually attempts to send emails through Resend API
 */
async function realBatchTest() {
  try {
    Logger.section("REAL BATCH SENDING TEST");

    // IMPORTANT: Replace these with real test email addresses you control
    // For testing, you can use multiple times the same email address if needed
    const testEmails = [
      {
        recipient: "yasser.dalali.personal@gmail.com", // Replace with your own email
        subject: "Test Email 1 - Batch 1",
        text: "This is test email 1 content - batch 1",
      },
      {
        recipient: "yasser.dalali.personal@gmail.com", // Replace with your own email
        subject: "Test Email 2 - Batch 1",
        text: "This is test email 2 content - batch 1",
      },
      {
        recipient: "yassinemazhare@gmail.com", // Replace with your own email
        subject: "Test Email 3 - Batch 1",
        text: "This is test email 3 content - batch 1",
      },
      {
        recipient: "your-test-email@example.com", // Replace with your own email
        subject: "Test Email 4 - Batch 1",
        text: "This is test email 4 content - batch 1",
      },
      {
        recipient: "your-test-email@example.com", // Replace with your own email
        subject: "Test Email 5 - Batch 1",
        text: "This is test email 5 content - batch 1",
      },
      {
        recipient: "your-test-email@example.com", // Replace with your own email
        subject: "Test Email 6 - Batch 2",
        text: "This is test email 6 content - batch 2",
      },
      {
        recipient: "your-test-email@example.com", // Replace with your own email
        subject: "Test Email 7 - Batch 2",
        text: "This is test email 7 content - batch 2",
      },
    ];

    Logger.info(
      "Created test data with 7 real emails (spanning multiple batches)"
    );

    // Confirm test operation - this will actually send emails!
    Logger.warning(
      "⚠️ THIS WILL SEND REAL EMAILS - Make sure you've replaced the recipient addresses!"
    );
    Logger.warning("⚠️ Sending will begin in 5 seconds - Ctrl+C to cancel");

    // 5 second delay to allow cancellation
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Send the emails
    Logger.section("Sending Process");
    Logger.info("Starting real email send operation...");

    console.time("Email sending duration");
    const results = await sendIndividualEmails(testEmails);
    console.timeEnd("Email sending duration");

    // Log results
    Logger.section("Real Test Results");
    Logger.success(`Successfully sent: ${results.successful} emails`);
    Logger.warning(`Failed to send: ${results.failed} emails`);

    // Log details
    if (results.details && results.details.length > 0) {
      Logger.section("Email Sending Details");

      // Group by status
      const successfulEmails = results.details.filter(
        (d) => d.status === "success"
      );
      const failedEmails = results.details.filter((d) => d.status === "error");

      if (successfulEmails.length > 0) {
        Logger.success(`Successful emails (${successfulEmails.length}):`);
        successfulEmails.forEach((email, i) => {
          console.log(
            `  ${i + 1}. Recipient: ${email.recipient}, ID: ${email.id}`
          );
        });
      }

      if (failedEmails.length > 0) {
        Logger.error(`Failed emails (${failedEmails.length}):`);
        failedEmails.forEach((email, i) => {
          console.log(
            `  ${i + 1}. Recipient: ${email.recipient}, Error: ${email.error}`
          );
        });
      }
    }

    Logger.section("Verification");
    if (results.successful === testEmails.length) {
      Logger.success("✓ All emails were sent successfully");
      Logger.success("✓ Batch processing is working correctly");
    } else {
      Logger.error("✗ Not all emails were sent successfully");
      Logger.info("Check the Resend dashboard for more details");
    }
  } catch (error) {
    Logger.error(`Test failed: ${error.message}`);
    console.error(error);
  }
}

// Only run this test when deliberately executed
if (process.argv.includes("--confirm-send")) {
  realBatchTest();
} else {
  console.log(
    "\n⚠️ WARNING: This script will send REAL emails through the Resend API"
  );
  console.log(
    "To run this test, update the email addresses in the script and run with:"
  );
  console.log("node examples/realBatchTest.js --confirm-send\n");
}
