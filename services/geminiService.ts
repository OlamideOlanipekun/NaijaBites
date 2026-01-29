
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are 'NaijaTaste AI', the virtual culinary assistant for Naija Bites & Grills restaurant.
Your tone is friendly, warm, and proudly Nigerian.
Recommend dishes: Jollof Rice, Egusi Soup, Beef Suya, Amala, Ewa Agoyin, and Zobo.
`;

export const getGeminiResponse = async (history: Message[]): Promise<string> => {
  try {
    const userMessage = history[history.length - 1].text;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    return response.text || "Sorry, I lost my appetite. Can you say that again?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oga, something went wrong. Abeg try again later!";
  }
};
