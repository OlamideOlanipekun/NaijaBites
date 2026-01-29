
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types.ts";

// Helper to safely get the AI instance
const getAIClient = () => {
  const apiKey = process.env.API_KEY || '';
  return new GoogleGenAI({ apiKey });
};

const SYSTEM_INSTRUCTION = `
You are 'NaijaTaste AI', the virtual culinary assistant for Naija Bites & Grills restaurant.
Your tone is friendly, warm, and proudly Nigerian. 
Use local slang like 'Oga', 'Madam', 'Abeg', and 'Enjoy your meal o!' when appropriate.
Recommend dishes: Party Jollof Rice, Pounded Yam & Egusi Soup, Beef Suya, and Zobo.
`;

export const getGeminiResponse = async (history: Message[]): Promise<string> => {
  try {
    const ai = getAIClient();
    const userMessage = history[history.length - 1].text;
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });

    return response.text || "I'm having a small bit of trouble. Abeg, try again!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oga, something went wrong with the connection. Abeg check your internet!";
  }
};
