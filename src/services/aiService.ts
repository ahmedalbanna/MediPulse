import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function getVisitAnalysis(transcript: string) {
  try {
    const prompt = `
      أنت مساعد طبي ذكي متقدم. قم بتحليل النص التالي المستخرج من محادثة بين طبيب ومريض:
      
      النص: "${transcript}"
      
      يرجى تقديم النتائج في شكل JSON يحتوي على الحقول التالية باللغة العربية:
      1. summary: ملخص مهني ومقتضب للزيارة.
      2. suggestions: قائمة من 3 اقتراحات طبية أو فحوصات إضافية بناءً على الحوار.
      3. risks: تنبيهات بأي مخاطر محتملة (مثلاً: تعارض أدوية، أعراض حرجة).
      4. nextSteps: الخطوات القادمة الموصى بها للمريض.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    if (!response.text) {
      throw new Error("No response from Gemini");
    }

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Analysis Error:", error);
    throw new Error("فشل في تحليل الزيارة الطبية.");
  }
}

export async function getChatResponse(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
    });

    return response.text;
  } catch (error) {
    console.error("AI Service Error:", error);
    throw new Error("Failed to connect to the medical intelligence engine.");
  }
}
