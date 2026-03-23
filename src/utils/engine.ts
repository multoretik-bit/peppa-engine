import { Story, Scenario, Character } from '../types';

export const generateScenarios = (story: Story): Scenario[] => {
  const characters = story.characters.length > 0 ? story.characters : [{ name: 'Герой', role: 'Протагонист' }];
  const mainChar = characters[0].name;
  const secondaryChar = characters[1]?.name || 'таинственный незнакомец';

  const scenarios: Scenario[] = [
    {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Неожиданный поворот',
      description: `Что если бы ${mainChar} принял совершенно иное решение в ключевой момент?`,
      steps: [
        `${mainChar} осознает последствия своего выбора`,
        `Появляется ${secondaryChar} с важным известием`,
        `Ситуация меняется на 180 градусов`
      ],
      outcome: 'История получает новое, непредсказуемое направление.'
    },
    {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Тайный заговор',
      description: `${mainChar} случайно узнает о чем-то, что скрывает ${secondaryChar}.`,
      steps: [
        `${mainChar} находит спрятанную улику`,
        `Происходит напряженный разговор с ${secondaryChar}`,
        `Тайное становится явным`
      ],
      outcome: 'Доверие подорвано, но истина раскрыта.'
    },
    {
      id: Math.random().toString(36).substr(2, 9),
      title: 'Героическое испытание',
      description: `${mainChar} и ${secondaryChar} сталкиваются с общим врагом или препятствием.`,
      steps: [
        `Возникает непреодолимая преграда`,
        `${mainChar} берет на себя инициативу`,
        `Благодаря командной работе препятствие преодолено`
      ],
      outcome: 'Связь между героями становится крепче.'
    }
  ];

  return scenarios;
};

export const parseStory = (text: string): Story => {
  // Простой поиск имен (слова с заглавной буквы в середине предложения или просто список)
  const nameRegex = /([А-Я][а-я]+)/g;
  const matches = text.match(nameRegex) || [];
  const uniqueNames = Array.from(new Set(matches)).filter(name => 
    !['Я', 'Он', 'Она', 'Они', 'Это', 'В', 'На', 'Но'].includes(name)
  );

  const characters: Character[] = uniqueNames.map(name => ({
    name,
    role: 'Персонаж'
  }));

  return {
    title: 'Анализ истории',
    content: text,
    characters: characters.slice(0, 5) // Берем первых 5 персонажей
  };
};
