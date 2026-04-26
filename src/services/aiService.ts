import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY is not set. AI features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY || "" });

export async function getChatResponse(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  if (!GEMINI_API_KEY) {
    throw new Error("AI Assistant is currently unavailable (Missing API Key).");
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        ...history,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: `You are 'MediPulse Assistant', a high-end integrated AI for a healthcare management system. 
        Your tone is professional, concise, and helpful. 
        You assist healthcare providers and staff with:
        1. Clinical decision support (based on general medical knowledge).
        2. System navigation and status updates.
        3. Patient record summaries.
        4. General medical queries.
        
        Always maintain a professional medical demeanor. If asked non-medical or non-system related questions, politely redirect to hospital operations.`,
      }
    });

    return response.text || "I'm sorry, I couldn't generate a response at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to the medical intelligence engine.");
  }
}
