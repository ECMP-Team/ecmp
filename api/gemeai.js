import { GoogleGenAI } from "@google/genai";
import { AI_API } from "../config/config";

const ai = new GoogleGenAI({ apiKey: AI_API });

async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: "Explain how AI works in a few words",
  });
  console.log(response.text);
}

await main();