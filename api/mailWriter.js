import { GoogleGenerativeAI } from "@google/generative-ai";
import { AI_API } from "../config/config.js";
import fs from "node:fs";
import mime from "mime-types";

const apiKey = AI_API;
const genAI = new GoogleGenerativeAI(apiKey);

// Use the latest model
const model = genAI.getGenerativeModel({
  model: "gemini-2.5-pro-exp-03-25",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 65536,
  responseMimeType: "application/json",
  responseSchema: {
    type: "object",
    properties: {
      subject: {
        type: "string",
      },
      text: {
        type: "string",
      },
      html: {
        type: "string",
      },
    },
    required: ["subject", "text", "html"],
  },
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
    });

    const message = `You are an expert AI email marketing copywriter specializing in high-conversion email campaigns. Your task is to craft a persuasive marketing email for ECMP, an AI-powered email campaign management platform that automates email writing and bulk sending.
The email must follow marketing best practices, including:
-Personalization: Address the recipient by name and mention their company.
-Relevance: Tailor the content based on the client's domain and notes.
-Persuasion: Highlight ECMP's benefits, addressing the client's specific challenges.
-Call-to-Action (CTA): Encourage the recipient to take action (e.g., book a demo, start a trial).

Compliance: Ensure a professional tone that follows email marketing regulations (no spammy language).

Your input is a JSON object with the client's details. Your output must be a JSON object with the following format:

{
"subject": "string",
"text": "string",
"html": "string"
}

Use the following client data:

${clientDataString}

Example Output:
{
"subject": "Boost Outreach for {{company}} with AI-Powered Email Campaigns",
"text": "Hi {{name}},\n\nI noticed that {{company}} is actively involved in {{domain}}, working to {{notes}}. Scaling outreach and engagement can be challenging, especially when managing high-volume email campaigns.\n\nECMP automates email writing and bulk sending with AI, helping organizations like yours save time and improve response rates. With our platform, you can craft highly targeted messages and reach more people efficiently.\n\nLet's set up a quick call to explore how ECMP can support your mission. Click here to schedule a demo: [Insert Link]\n\nBest,\n[Your Name]  \nECMP Team",
"html": "<p>Hi {{name}},</p>\n<p>I noticed that <strong>{{company}}</strong> is actively involved in {{domain}}, working to {{notes}}. Scaling outreach and engagement can be challenging, especially when managing high-volume email campaigns.</p>\n<p>ECMP automates email writing and bulk sending with AI, helping organizations like yours save time and improve response rates. With our platform, you can craft highly targeted messages and reach more people efficiently.</p>\n<p>Let's set up a quick call to explore how ECMP can support your mission. <a href='[Insert Link]'>Click here to schedule a demo</a>.</p>\n<p>Best,<br>[Your Name]<br>ECMP Team</p>"
}`;

    // Send the client data to generate a personalized email
    const result = await chatSession.sendMessage(message);
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
