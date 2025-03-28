import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";
import fs from "node:fs";
import mime from "mime-types";
import { AI_API } from "../config/config";

const apiKey = AI_API;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseModalities: [
        "image",
        "text",
    ],
    responseMimeType: "text/plain",
};

async function writeMail() {
    const chatSession = model.startChat({
        generationConfig,
        history: [
            {
                role: "user",
                parts: [
                    {text: "You are an expert AI email marketing copywriter specializing in high-conversion email campaigns. Your task is to craft a persuasive marketing email for ECMP, an AI-powered email campaign management platform that automates email writing and bulk sending.\nThe email must follow marketing best practices, including:\n-Personalization: Address the recipient by name and mention their company.\n-Relevance: Tailor the content based on the client's domain and notes.\n-Persuasion: Highlight ECMP’s benefits, addressing the client’s specific challenges.\n-Call-to-Action (CTA): Encourage the recipient to take action (e.g., book a demo, start a trial).\n\nCompliance: Ensure a professional tone that follows email marketing regulations (no spammy language).\n\nYour input is a JSON object with the client's details. Your output must be a JSON object with the following format:\n\n{\n  \"subject\": \"string\",\n  \"text\": \"string\",\n  \"html\": \"string\"\n}\n\nUse the following client data:\n{\n  \"domain\": \"{{domain}}\",\n  \"company\": \"{{company}}\",\n  \"email\": \"{{email}}\",\n  \"name\": \"{{name}}\",\n  \"position\": \"{{position}}\",\n  \"notes\": \"{{notes}}\"\n}\n\nExample Output:\n{\n  \"subject\": \"Boost Outreach for {{company}} with AI-Powered Email Campaigns\",\n  \"text\": \"Hi {{name}},\\n\\nI noticed that {{company}} is actively involved in {{domain}}, working to {{notes}}. Scaling outreach and engagement can be challenging, especially when managing high-volume email campaigns.\\n\\nECMP automates email writing and bulk sending with AI, helping organizations like yours save time and improve response rates. With our platform, you can craft highly targeted messages and reach more people efficiently.\\n\\nLet's set up a quick call to explore how ECMP can support your mission. Click here to schedule a demo: [Insert Link]\\n\\nBest,\\n[Your Name]  \\nECMP Team\",\n  \"html\": \"<p>Hi {{name}},</p>\\n<p>I noticed that <strong>{{company}}</strong> is actively involved in {{domain}}, working to {{notes}}. Scaling outreach and engagement can be challenging, especially when managing high-volume email campaigns.</p>\\n<p>ECMP automates email writing and bulk sending with AI, helping organizations like yours save time and improve response rates. With our platform, you can craft highly targeted messages and reach more people efficiently.</p>\\n<p>Let's set up a quick call to explore how ECMP can support your mission. <a href='[Insert Link]'>Click here to schedule a demo</a>.</p>\\n<p>Best,<br>[Your Name]<br>ECMP Team</p>\"\n}"},
                ],
            },
            {
                role: "model",
                parts: [
                    {text: "{\n  \"subject\": \"Enhance Your {{company}} Outreach with AI-Powered Email Automation\",\n  \"text\": \"Hi {{name}},\\n\\nSeeing {{company}}'s work in {{domain}} and your focus on {{notes}}, I understand the importance of efficient and impactful communication. Managing effective email campaigns at scale can often be time-consuming and resource-intensive.\\n\\nECMP is an AI-powered email campaign management platform designed to automate both the writing and bulk sending of emails. This allows organizations like {{company}} to significantly reduce the time spent on email creation and execution while simultaneously improving engagement and deliverability.\\n\\nImagine being able to craft personalized, high-converting emails in minutes and reach your target audience with ease. ECMP can help you achieve this and more.\\n\\nWould you be open to a brief discussion to see how ECMP can specifically address your outreach needs at {{company}}? You can schedule a quick demo here: [Insert Your Demo Link]\\n\\nBest regards,\\n\\nYour Name\\nECMP Team\",\n  \"html\": \"<p>Hi {{name}},</p>\\n\\n<p>Seeing <strong>{{company}}'s</strong> work in {{domain}} and your focus on {{notes}}, I understand the importance of efficient and impactful communication. Managing effective email campaigns at scale can often be time-consuming and resource-intensive.</p>\\n\\n<p>ECMP is an AI-powered email campaign management platform designed to automate both the writing and bulk sending of emails. This allows organizations like <strong>{{company}}</strong> to significantly reduce the time spent on email creation and execution while simultaneously improving engagement and deliverability.</p>\\n\\n<p>Imagine being able to craft personalized, high-converting emails in minutes and reach your target audience with ease. ECMP can help you achieve this and more.</p>\\n\\n<p>Would you be open to a brief discussion to see how ECMP can specifically address your outreach needs at <strong>{{company}}</strong>? You can <a href=\\\"{{demo_link}}\\\">schedule a quick demo here</a>.</p>\\n\\n<p>Best regards,</p>\\n\\n<p>Your Name<br>ECMP Team</p>\"\n}"},
                ],
            },
        ],
    });

    const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
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

export default writeMail