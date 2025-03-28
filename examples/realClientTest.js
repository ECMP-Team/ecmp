import { sendIndividualEmails } from "../mail/resend.js";
import writeMail from "../api/mailWriter.js";
import { Logger } from "../utils/logger.js";

/**
 * Test to generate and send emails with client data
 */
async function realClientTest() {
  try {
    Logger.section("CLIENT DATA EMAIL TEST");

    // Sample client data
    const clients = [
      {
        name: "Yasser",
        email: "yasser.dalali.personal@gmail.com",
        company: "MarketEdge",
        domain: "digital marketing",
        position: "Marketing Director",
        notes: "looking to improve email engagement rates",
      },
      {
        name: "Yassine",
        email: "yassinemazhare@gmail.com",
        company: "TechNova",
        domain: "software development",
        position: "CEO",
        notes: "interested in automating customer outreach",
      },
    ];

    Logger.info(`Created test data with ${clients.length} client profiles`);
    Logger.warning("⚠️ THIS WILL GENERATE AND SEND REAL EMAILS");
    Logger.warning("⚠️ Sending will begin in 3 seconds - Ctrl+C to cancel");

    // 3 second delay to allow cancellation
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Generate and send emails
    Logger.section("Email Generation Process");

    const emailPromises = clients.map(async (client) => {
      try {
        Logger.info(
          `Generating email for ${client.name} at ${client.company}...`
        );
        const emailContent = await writeMail(client);

        return {
          recipient: client.email,
          subject: emailContent.subject,
          text: emailContent.text,
          html: emailContent.html,
        };
      } catch (error) {
        Logger.error(
          `Failed to generate email for ${client.email}: ${error.message}`
        );
        return null;
      }
    });

    const emailsToSend = (await Promise.all(emailPromises)).filter(Boolean);

    Logger.info(`Successfully generated ${emailsToSend.length} emails`);

    if (emailsToSend.length === 0) {
      Logger.error("No emails to send, exiting.");
      return;
    }

    // Preview first email
    Logger.section("Email Preview");
    Logger.info(`First Email Subject: ${emailsToSend[0].subject}`);
    Logger.info(
      `Text Content Sample: ${emailsToSend[0].text.substring(0, 100)}...`
    );

    // Send the emails
    Logger.section("Sending Process");
    Logger.info("Starting email send operation...");

    const results = await sendIndividualEmails(
      emailsToSend,
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
realClientTest();
