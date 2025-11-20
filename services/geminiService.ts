import { GoogleGenAI } from "@google/genai";
import { SERVICES } from "../constants";

export const getGeminiSuggestion = async (userInput: string): Promise<string> => {
  try {
    // In a real production app, this check handles if the environment variable is missing.
    if (!process.env.API_KEY) {
      console.warn("Gemini API Key is missing.");
      return "Извините, я сейчас офлайн. Пожалуйста, выберите услугу из списка.";
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const serviceDescriptions = SERVICES.map(s => `- ${s.name} (${s.price}₽): ${s.description}`).join('\n');

    const systemInstruction = `
      Ты "TurboBot", дружелюбный и знающий помощник автомойки TurboClean.
      Твоя цель — порекомендовать лучшую услугу мойки на основе описания состояния автомобиля пользователя.
      
      Наши услуги:
      ${serviceDescriptions}
      
      Правила:
      1. Отвечай кратко (менее 50 слов).
      2. Будь энтузиастом, но профессионалом.
      3. Конкретно называй услугу, которую рекомендуешь.
      4. Если пользователь спрашивает о чем-то постороннем, вежливо верни его к теме мойки машин.
      5. Отвечай на Русском языке.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userInput,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "Я не совсем понял, но наш Стандарт Блеск всегда отличный выбор!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "У меня проблемы с подключением. Пожалуйста, выберите услугу вручную.";
  }
};