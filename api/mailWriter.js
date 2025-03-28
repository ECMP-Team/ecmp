import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_API } from "../config/config.js";

const apiKey = AI_API;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

/**
 * Generates email content using AI based on client data
 * @param {Object} clientData - Client data to use for email generation
 * @returns {Promise<Object>} - Email content with subject, text, and html
 */
async function writeMail(clientData = {}) {
  try {
    console.log("Generating email content for:", clientData);

    // Create client data string for the prompt
    const clientDataString = JSON.stringify(clientData, null, 2);

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: 'You are an expert AI email marketing copywriter specializing in high-conversion email campaigns. Your task is to craft a persuasive marketing email for ECMP, an AI-powered email campaign management platform that automates email writing and bulk sending.\nThe email must follow marketing best practices, including:\n-Personalization: Address the recipient by name and mention their company.\n-Relevance: Tailor the content based on the client\'s domain and notes.\n-Persuasion: Highlight ECMP\'s benefits, addressing the client\'s specific challenges.\n-Call-to-Action (CTA): Encourage the recipient to take action (e.g., book a demo, start a trial).\n\nCompliance: Ensure a professional tone that follows email marketing regulations (no spammy language).\n\nYour input is a JSON object with the client\'s details. Your output must be a JSON object with the following format:\n\n{\n  "subject": "string",\n  "text": "string",\n  "html": "string"\n}\n\nUse the following client data:\n{\n  "domain": "{{domain}}",\n  "company": "{{company}}",\n  "email": "{{email}}",\n  "name": "{{name}}",\n  "position": "{{position}}",\n  "notes": "{{notes}}"\n}\n\nExample Output:\n{\n  "subject": "Boost Outreach for {{company}} with AI-Powered Email Campaigns",\n  "text": "Hi {{name}},\\n\\nI noticed that {{company}} is actively involved in {{domain}}, working to {{notes}}. Scaling outreach and engagement can be challenging, especially when managing high-volume email campaigns.\\n\\nECMP automates email writing and bulk sending with AI, helping organizations like yours save time and improve response rates. With our platform, you can craft highly targeted messages and reach more people efficiently.\\n\\nLet\'s set up a quick call to explore how ECMP can support your mission. Click here to schedule a demo: [Insert Link]\\n\\nBest,\\n[Your Name]  \\nECMP Team",\n  "html": "<p>Hi {{name}},</p>\\n<p>I noticed that <strong>{{company}}</strong> is actively involved in {{domain}}, working to {{notes}}. Scaling outreach and engagement can be challenging, especially when managing high-volume email campaigns.</p>\\n<p>ECMP automates email writing and bulk sending with AI, helping organizations like yours save time and improve response rates. With our platform, you can craft highly targeted messages and reach more people efficiently.</p>\\n<p>Let\'s set up a quick call to explore how ECMP can support your mission. <a href=\'[Insert Link]\'>Click here to schedule a demo</a>.</p>\\n<p>Best,<br>[Your Name]<br>ECMP Team</p>"\n}',
            },
          ],
        },
        {
          role: "model",
          parts: [
            {
              text: '{\n  "subject": "Enhance Your {{company}} Outreach with AI-Powered Email Automation",\n  "text": "Hi {{name}},\\n\\nSeeing {{company}}\'s work in {{domain}} and your focus on {{notes}}, I understand the importance of efficient and impactful communication. Managing effective email campaigns at scale can often be time-consuming and resource-intensive.\\n\\nECMP is an AI-powered email campaign management platform designed to automate both the writing and bulk sending of emails. This allows organizations like {{company}} to significantly reduce the time spent on email creation and execution while simultaneously improving engagement and deliverability.\\n\\nImagine being able to craft personalized, high-converting emails in minutes and reach your target audience with ease. ECMP can help you achieve this and more.\\n\\nWould you be open to a brief discussion to see how ECMP can specifically address your outreach needs at {{company}}? You can schedule a quick demo here: [Insert Your Demo Link]\\n\\nBest regards,\\n\\nYour Name\\nECMP Team",\n  "html": "<p>Hi {{name}},</p>\\n\\n<p>Seeing <strong>{{company}}\'s</strong> work in {{domain}} and your focus on {{notes}}, I understand the importance of efficient and impactful communication. Managing effective email campaigns at scale can often be time-consuming and resource-intensive.</p>\\n\\n<p>ECMP is an AI-powered email campaign management platform designed to automate both the writing and bulk sending of emails. This allows organizations like <strong>{{company}}</strong> to significantly reduce the time spent on email creation and execution while simultaneously improving engagement and deliverability.</p>\\n\\n<p>Imagine being able to craft personalized, high-converting emails in minutes and reach your target audience with ease. ECMP can help you achieve this and more.</p>\\n\\n<p>Would you be open to a brief discussion to see how ECMP can specifically address your outreach needs at <strong>{{company}}</strong>? You can <a href=\\"{{demo_link}}\\">schedule a quick demo here</a>.</p>\\n\\n<p>Best regards,</p>\\n\\n<p>Your Name<br>ECMP Team</p>"\n}',
            },
          ],
        },
      ],
    });

    // Send the client data to generate a personalized email
    const result = await chatSession.sendMessage(
      `Generate an email for this client data: ${clientDataString}`
    );
    const responseText = result.response.text();

    // Parse the response to extract the email content
    const emailContent = parseResponseToEmailContent(responseText, clientData);

    return emailContent;
  } catch (error) {
    console.error("Error generating email:", error);

    // Fallback to a template if AI generation fails
    return {
      subject: `Special offer for ${clientData.company || "your company"}`,
      text: `Hello ${
        clientData.name || "there"
      },\n\nWe would like to offer you our email campaign management services.\n\nBest regards,\nECMP Team`,
      html: `<p>Hello ${
        clientData.name || "there"
      },</p><p>We would like to offer you our email campaign management services.</p><p>Best regards,<br>ECMP Team</p>`,
    };
  }
}

/**
 * Parse the AI response text to extract the email content
 * @param {string} responseText - Raw response from the AI
 * @param {Object} clientData - Client data for fallback
 * @returns {Object} - Parsed email content
 */
function parseResponseToEmailContent(responseText, clientData) {
  try {
    // Try to parse as JSON
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const jsonContent = JSON.parse(jsonMatch[0]);

      // Replace placeholders with actual values
      const replacedContent = replaceTemplateVariables(jsonContent, clientData);

      return replacedContent;
    }

    // Fallback if parsing fails
    throw new Error("Could not parse AI response as JSON");
  } catch (error) {
    console.error("Error parsing AI response:", error);

    // Fallback to a simple template
    return {
      subject: `Special offer for ${clientData.company || "your company"}`,
      text: `Hello ${
        clientData.name || "there"
      },\n\nWe would like to offer you our email campaign management services.\n\nBest regards,\nECMP Team`,
      html: `<p>Hello ${
        clientData.name || "there"
      },</p><p>We would like to offer you our email campaign management services.</p><p>Best regards,<br>ECMP Team</p>`,
    };
  }
}

/**
 * Replace template variables in the email content
 * @param {Object} template - Email template with placeholders
 * @param {Object} clientData - Actual client data
 * @returns {Object} - Email content with replaced variables
 */
function replaceTemplateVariables(template, clientData) {
  const replacedContent = {};

  // Process each field in the template
  for (const [key, value] of Object.entries(template)) {
    if (typeof value === "string") {
      let replacedValue = value;

      // Replace each placeholder with actual value
      for (const [dataKey, dataValue] of Object.entries(clientData)) {
        const placeholder = new RegExp(`{{\\s*${dataKey}\\s*}}`, "g");
        replacedValue = replacedValue.replace(placeholder, dataValue || "");
      }

      replacedContent[key] = replacedValue;
    } else {
      replacedContent[key] = value;
    }
  }

  return replacedContent;
}

export default writeMail;
