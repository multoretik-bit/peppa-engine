import { GoogleGenerativeAI } from "@google/generative-ai";
import { Scenario, Character } from "../types";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAIScenarios = async (
  prompt: string, 
  count: number = 5
): Promise<{ scenarios: Scenario[], characters: Character[] }> => {
  const fullPrompt = `
    Ты - профессиональный сценарист. На основе следующей истории: "${prompt}"
    Создай ${count} различных сценариев развития сюжета.
    Каждый сценарий должен быть подробным (около 2000-3000 символов суммарно с шагами).
    
    Верни ответ СТРОГО в формате JSON:
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
    
    Используй русский язык.
  `;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Очистка текста от возможных markdown-тегов ```json ... ```
    const cleanJson = text.replace(/```json|```/gi, "").trim();
    const data = JSON.parse(cleanJson);
    
    return {
      scenarios: data.scenarios.map((s: any) => ({
        ...s,
        id: Math.random().toString(36).substr(2, 9)
      })),
      characters: data.characters || []
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Не удалось сгенерировать сценарии. Проверьте API ключ или промпт.");
  }
};
