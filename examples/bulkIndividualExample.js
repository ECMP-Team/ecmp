import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { parseFile } from "../utils/excelParser.js";
import { createIndividualEmails } from "../utils/dataProcessor.js";
import { sendIndividualEmails } from "../mail/resend.js";
import { Logger } from "../utils/logger.js";

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Example demonstrating how to send individualized bulk emails
 */
async function runExample() {
  try {
    Logger.section("Bulk Individual Email Example");

    // 1. Parse the Excel file (using your existing sample data)
    const excelFile = path.resolve(__dirname, "../mock/sample.xlsx");
    Logger.info(`Parsing Excel file: ${excelFile}`);
    const processedData = await parseFile(excelFile);

    Logger.info(
      `Found ${processedData.data.length} valid leads in the Excel file`
    );

    // 2. Define an email template with placeholders
    const template = {
      subject: "Hello {{firstName}} from {{companyName}}",
      text: `Hi {{firstName}},

We noticed that you work at {{companyName}} in the {{industry}} industry.

Would you be interested in our email campaign management platform?

Best regards,
ECMP Team`,
      html: `<p>Hi <strong>{{firstName}}</strong>,</p>
<p>We noticed that you work at <strong>{{companyName}}</strong> in the <strong>{{industry}}</strong> industry.</p>
<p>Would you be interested in our email campaign management platform?</p>
<p>Best regards,<br>ECMP Team</p>`,
    };

    // 3. Create individual email objects from the processed data
    const emails = createIndividualEmails(processedData, template);

    // 4. Preview the first email
    if (emails.length > 0) {
      Logger.section("Email Preview");
      const firstEmail = emails[0];
      console.log(`To: ${firstEmail.recipient}`);
      console.log(`Subject: ${firstEmail.subject}`);
      console.log("Text content:");
      console.log(firstEmail.text);
      console.log("\nHTML content:");
      console.log(firstEmail.html);
    }

    // 5. Send the emails (commented out for safety - uncomment to actually send)
    Logger.section("Sending Emails");
    Logger.info("This is a dry run - emails will not be sent");

    /*
    // Uncomment to actually send the emails
    const results = await sendIndividualEmails(emails);
    Logger.info(`Successfully sent: ${results.successful}`);
    Logger.warning(`Failed to send: ${results.failed}`);
    */

    Logger.section("Example Complete");
  } catch (error) {
    Logger.error(`Example failed: ${error.message}`);
    console.error(error);
  }
}

// Run the example when this file is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runExample();
}

export default runExample;
