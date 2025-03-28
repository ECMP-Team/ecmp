import { AI_API } from "../config/config.js";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import fs from "node:fs";
import mime from "mime-types";
  
  const apiKey = AI_API;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-pro-exp-03-25",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 65536,
    responseModalities: [
    ],
    responseMimeType: "application/json",
    responseSchema: {
      type: "object",
      properties: {
        subject: {
          type: "string"
        },
        text: {
          type: "string"
        },
        html: {
          type: "string"
        }
      },
      required: [
        "subject",
        "text",
        "html"
      ]
    },
  };
  
  async function writeMail(clientData) {
    const chatSession = model.startChat({
      generationConfig,
    });
    const message = `You are an expert AI email marketing copywriter specializing in high-conversion email campaigns. Your task is to craft a persuasive marketing email for ECMP, an AI-powered email campaign management platform that automates email writing and bulk sending.
The email must follow marketing best practices, including:
-Personalization: Address the recipient by name and mention their company.
-Relevance: Tailor the content based on the client's domain and notes.
-Persuasion: Highlight ECMP’s benefits, addressing the client’s specific challenges.
-Call-to-Action (CTA): Encourage the recipient to take action (e.g., book a demo, start a trial).

Compliance: Ensure a professional tone that follows email marketing regulations (no spammy language).

Your input is a JSON object with the client's details. Your output must be a JSON object with the following format:

{
"subject": "string",
"text": "string",
"html": "string"
}

Use the following client data:

${
    clientData
},

Example Output:
{
"subject": "Boost Outreach for {{company}} with AI-Powered Email Campaigns",
"text": "Hi {{name}},\n\nI noticed that {{company}} is actively involved in {{domain}}, working to {{notes}}. Scaling outreach and engagement can be challenging, especially when managing high-volume email campaigns.\n\nECMP automates email writing and bulk sending with AI, helping organizations like yours save time and improve response rates. With our platform, you can craft highly targeted messages and reach more people efficiently.\n\nLet's set up a quick call to explore how ECMP can support your mission. Click here to schedule a demo: [Insert Link]\n\nBest,\n[Your Name]  \nECMP Team",
"html": "<p>Hi {{name}},</p>\n<p>I noticed that <strong>{{company}}</strong> is actively involved in {{domain}}, working to {{notes}}. Scaling outreach and engagement can be challenging, especially when managing high-volume email campaigns.</p>\n<p>ECMP automates email writing and bulk sending with AI, helping organizations like yours save time and improve response rates. With our platform, you can craft highly targeted messages and reach more people efficiently.</p>\n<p>Let's set up a quick call to explore how ECMP can support your mission. <a href='[Insert Link]'>Click here to schedule a demo</a>.</p>\n<p>Best,<br>[Your Name]<br>ECMP Team</p>"
}`
    const result = await chatSession.sendMessage(message);
    // TODO: Following code needs to be updated for client-side apps.
    const candidates = result.response.candidates;
    for(let candidate_index = 0; candidate_index < candidates.length; candidate_index++) {
      for(let part_index = 0; part_index < candidates[candidate_index].content.parts.length; part_index++) {
        const part = candidates[candidate_index].content.parts[part_index];
        if(part.inlineData) {
          try {
            const filename = `output_${candidate_index}_${part_index}.${mime.extension(part.inlineData.mimeType)}`;
            fs.writeFileSync(filename, Buffer.from(part.inlineData.data, 'base64'));
            console.log(`Output written to: ${filename}`);
          } catch (err) {
            console.error(err);
          }
        }
      }
    }
    console.log(result.response.text());
  }
  
export default writeMail;