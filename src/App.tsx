import React, { useState } from 'react';
import StoryInput from './components/StoryInput';
import ScenarioList from './components/ScenarioList';
import { generateScenarios, parseStory } from './utils/engine';
import { Scenario, Story } from './types';
import './App.css';

const App: React.FC = () => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerate = (text: string): void => {
    setIsLoading(true);
    setScenarios([]);
    
    // Симуляция задержки для "анализа"
    setTimeout(() => {
      const parsedStory = parseStory(text);
      const generated = generateScenarios(parsedStory);
      setStory(parsedStory);
      setScenarios(generated);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Peppa Engine</h1>
        <p className="subtitle">Интеллектуальный генератор сюжетных поворотов</p>
      </header>

      <main className="app-main">
        <StoryInput onGenerate={handleGenerate} isLoading={isLoading} />
        
        {story && story.characters.length > 0 && (
          <div className="characters-section">
            <h3>Обнаруженные персонажи:</h3>
            <div className="character-tags">
              {story.characters.map((char, i) => (
                <span key={i} className="character-tag">{char.name}</span>
              ))}
            </div>
          </div>
        )}

        {scenarios.length > 0 && (
          <div className="results-section">
            <h2>Возможные сценарии</h2>
            <ScenarioList scenarios={scenarios} />
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>&copy; 2026 Peppa Engine. Превращаем идеи в миры.</p>
      </footer>
    </div>
  );
}

export default App;
