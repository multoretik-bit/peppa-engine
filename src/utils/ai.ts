import { GoogleGenerativeAI } from "@google/generative-ai";
import { Scenario, Character } from "../types";

export const generateAIScenarios = async (
  prompt: string, 
  count: number = 5,
  apiKey?: string
): Promise<{ scenarios: Scenario[], characters: Character[] }> => {
  const finalApiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!finalApiKey || finalApiKey === "YOUR_API_KEY_HERE") {
    throw new Error("API ключ не найден. Пожалуйста, введите его в настройках.");
  }

  const genAI = new GoogleGenerativeAI(finalApiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const fullPrompt = `
    Ты - профессиональный сценарист. На основе следующей истории: "${prompt}"
    Создай ${count} различных сценариев развития сюжета.
    Каждый сценарий должен быть подробным (около 2000-3000 символов суммарно с шагами).
    
    Верни ответ СТРОГО в формате JSON без использования markdown блоков:
    {
      "characters": [{"name": "имя", "role": "роль"}],
      "scenarios": [
        {
          "title": "название",
          "description": "подробное описание (300-500 символов)",
          "steps": ["шаг 1", "шаг 2", "шаг 3", "шаг 4", "шаг 5"],
          "outcome": "финальный итог"
        }
      ]
    }
  `;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Пытаемся найти JSON-объект в тексте (между первой { и последней })
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("ИИ вернул ответ в некорректном формате (не найден JSON).");
    }

    const data = JSON.parse(jsonMatch[0]);
    
    return {
      scenarios: data.scenarios.map((s: any) => ({
        ...s,
        id: Math.random().toString(36).substr(2, 9)
      })),
      characters: data.characters || []
    };
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message.includes("API key not valid")) {
      throw new Error("Неверный API ключ. Проверьте настройки.");
    }
    throw new Error(error.message || "Не удалось сгенерировать сценарии. Попробуйте еще раз.");
  }
};
