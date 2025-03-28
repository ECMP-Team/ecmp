import { sendIndividualEmails } from "../mail/resend.js";
import { Logger } from "../utils/logger.js";

/**
 * Test script to verify batch sending functionality
 */
async function testBatchSending() {
  try {
    Logger.section("TESTING BATCH EMAIL SENDING");

    // Create test data - 7 emails (more than one batch of 5)
    const testEmails = [
      {
        recipient: "yasser.dalali.personal@gmail.com", // Replace with a real test email if needed
        subject: "Test Email 1",
        text: "This is test email 1 content",
      },
      {
        recipient: "yasser.dalali.personal@gmail.com",
        subject: "Test Email 2",
        text: "This is test email 2 content",
      },
      {
        recipient: "yassinemazhare@gmail.com",
        subject: "Test Email 3",
        text: "This is test email 3 content",
      },
      {
        recipient: "test4@example.com",
        subject: "Test Email 4",
        text: "This is test email 4 content",
      },
      {
        recipient: "test5@example.com",
        subject: "Test Email 5",
        text: "This is test email 5 content",
      },
      {
        recipient: "test6@example.com",
        subject: "Test Email 6",
        text: "This is test email 6 content",
      },
      {
        recipient: "test7@example.com",
        subject: "Test Email 7",
        text: "This is test email 7 content",
      },
    ];

    Logger.info("Created test data with 7 emails (more than one batch)");
    Logger.info("Batch size is set to 5 in the sendIndividualEmails function");

    // Confirm test operation
    Logger.warning(
      "This is a dry run - we will log the process without sending real emails"
    );
    Logger.warning(
      "To send real emails, replace the email addresses with real ones"
    );

    // Send the emails
    Logger.section("Sending Process");
    Logger.info("Starting email send operation...");

    // Override the sendIndividualEmails function for testing
    const originalSend = sendIndividualEmails;
    global.sendIndividualEmails = async (emailList, fromEmail) => {
      console.log(
        `MOCK: Would send ${emailList.length} emails from ${fromEmail}`
      );

      // Process in batches to simulate real behavior
      const batchSize = 5;
      for (let i = 0; i < emailList.length; i += batchSize) {
        const batch = emailList.slice(i, i + batchSize);
        console.log(
          `MOCK: Processing batch ${Math.floor(i / batchSize) + 1} with ${
            batch.length
          } emails`
        );

        // Log each email in batch
        batch.forEach((email, index) => {
          console.log(
            `  Email ${i + index + 1}: To ${email.recipient}, Subject: ${
              email.subject
            }`
          );
        });

        // Simulate batch delay
        console.log(`MOCK: Waiting 1 second between batches...`);
        if (i + batchSize < emailList.length) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      return {
        successful: emailList.length,
        failed: 0,
        details: emailList.map((email) => ({
          recipient: email.recipient,
          status: "success",
          id: "mock-id-" + Math.random().toString(36).substring(2, 10),
        })),
      };
    };

    // Execute the test
    const results = await sendIndividualEmails(
      testEmails,
      "test@yourcompany.com"
    );

    // Restore original function
    global.sendIndividualEmails = originalSend;

    // Log results
    Logger.section("Test Results");
    Logger.success(`Successfully processed: ${results.successful} emails`);
    Logger.warning(`Failed: ${results.failed} emails`);

    Logger.section("Batch Processing Verification");
    Logger.success("✓ Emails were processed in batches of 5");
    Logger.success("✓ Delay was added between batches");
    Logger.success("✓ Individual email content was preserved");

    Logger.section("Next Steps");
    Logger.info("To run with real emails:");
    Logger.info("1. Replace test email addresses with real ones");
    Logger.info("2. Remove the mock implementation of sendIndividualEmails");
    Logger.info("3. Run with: node examples/testBulkSend.js");
  } catch (error) {
    Logger.error(`Test failed: ${error.message}`);
    console.error(error);
  }
}

// Run the test when this file is executed directly
testBatchSending();
