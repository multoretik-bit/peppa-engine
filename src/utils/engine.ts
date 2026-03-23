import { Story, Scenario, Character } from '../types';
import { generateAIScenarios } from './ai';

export const generateScenarios = async (story: Story): Promise<{ scenarios: Scenario[], characters: Character[] }> => {
  try {
    const result = await generateAIScenarios(story.content);
    return result;
  } catch (error) {
    console.error("Engine generation error:", error);
    // Fallback or re-throw
    throw error;
  }
};

export const parseStory = (text: string): Story => {
  // Простой парсер перед отправкой в ИИ
  return {
    title: 'Анализ истории',
    content: text,
    characters: [] // ИИ заполнит это сам
  };
};
