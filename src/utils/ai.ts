import { GoogleGenerativeAI } from "@google/generative-ai";
import { Scenario, Character } from "../types";

export const generateAIScenarios = async (
  prompt: string, 
  count: number = 5,
  apiKey?: string
): Promise<{ scenarios: Scenario[], characters: Character[] }> => {
  const finalApiKey = apiKey || import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!finalApiKey || finalApiKey === "YOUR_API_KEY_HERE" || finalApiKey.trim() === "") {
    throw new Error("API ключ не найден. Зайдите в Настройки (иконка шестеренки) и вставьте ваш ключ Gemini.");
  }

  try {
    const genAI = new GoogleGenerativeAI(finalApiKey);
    // Используем flash модель для скорости и экономии
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const fullPrompt = `
      Ты - мастер-сценарист. Проанализируй эту историю: "${prompt.replace(/"/g, "'")}"
      Создай ${count} уникальных сценариев продолжения.
      
      ВАЖНО: Ответ должен быть ТОЛЬКО в формате JSON, без лишнего текста, без markdown блоков (без \`\`\`json).
      Если не получается создать много, создай хотя бы один.
      
      Структура JSON:
      {
        "characters": [{"name": "имя", "role": "роль"}],
        "scenarios": [
          {
            "title": "название",
            "description": "подробное описание (минимум 300 символов)",
            "steps": ["шаг 1", "шаг 2", "шаг 3", "шаг 4", "шаг 5"],
            "outcome": "финальный итог"
          }
        ]
      }
    `;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    console.log("Raw AI response:", text);

    // Более надежное извлечение JSON: ищем все от первой { до последней }
    const startIdx = text.indexOf('{');
    const endIdx = text.lastIndexOf('}');
    
    if (startIdx === -1 || endIdx === -1) {
      throw new Error("ИИ вернул ответ в текстовом формате вместо JSON. Попробуйте еще раз.");
    }

    const jsonText = text.substring(startIdx, endIdx + 1);
    
    try {
      const data = JSON.parse(jsonText);
      
      if (!data.scenarios || !Array.isArray(data.scenarios)) {
        throw new Error("В ответе ИИ отсутствуют сценарии.");
      }

      return {
        scenarios: data.scenarios.map((s: any) => ({
          ...s,
          id: Math.random().toString(36).substr(2, 9),
          title: s.title || "Без названия",
          description: s.description || "Нет описания",
          steps: Array.isArray(s.steps) ? s.steps : ["Шаг 1"],
          outcome: s.outcome || "Итог не определен"
        })),
        characters: Array.isArray(data.characters) ? data.characters : []
      };
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError, "Text:", jsonText);
      throw new Error(`Ошибка обработки ответа: ${parseError instanceof Error ? parseError.message : "Невалидный JSON"}`);
    }
  } catch (error: any) {
    console.error("Generation error details:", error);
    
    if (error.message?.includes("API key not valid")) {
      throw new Error("Ваш API ключ недействителен. Пожалуйста, проверьте и обновите его в настройках.");
    }
    
    if (error.message?.includes("fetch failed") || error.message?.includes("NetworkError")) {
      throw new Error("Ошибка сети при подключении к Google AI. Проверьте интернет или VPN.");
    }

    throw error;
  }
};
