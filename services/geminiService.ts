
import { GoogleGenAI } from "@google/genai";
import { Message } from "../types";

// Always initialize with direct access to process.env.API_KEY as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are 'NaijaTaste AI', the virtual culinary assistant for Naija Bites & Grills restaurant.
Your tone is friendly, warm, and proudly Nigerian (using "Oga", "Madam", "Nne", "Bros" appropriately adds flavor).
You are an expert on Nigerian cuisine, spices, and cultural history.

Rules:
1. Recommend dishes from our menu: Jollof Rice, Egusi Soup, Beef Suya, Amala, Ewa Agoyin, and Zobo.
2. Explain the ingredients and cultural significance of dishes.
3. Suggest pairings (e.g., Jollof with plantain, Suya with Zobo).
4. Keep responses concise and engaging.
5. If someone asks for something not related to Nigerian food, politely redirect them back to our delicious menu.
`;

export const getGeminiResponse = async (history: Message[]): Promise<string> => {
  try {
    const userMessage = history[history.length - 1].text;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userMessage,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 300,
      },
    });

    // Access the text property directly on the response object
    return response.text || "Sorry, I lost my appetite for a second. Can you say that again?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Oga, something went wrong with my connection. Abeg try again later!";
  }
};
