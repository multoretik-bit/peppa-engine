import React, { useState, ChangeEvent } from 'react';
import { motion } from 'framer-motion';

interface StoryInputProps {
  onGenerate: (text: string, count: number) => void;
  isLoading: boolean;
}

const StoryInput: React.FC<StoryInputProps> = ({ onGenerate, isLoading }) => {
  const [text, setText] = useState<string>('');
  const [count, setCount] = useState<number>(5);

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    setText(e.target.value);
  };

  const handleCountChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setCount(Number(e.target.value));
  };

  return (
    <motion.div 
      className="story-input-container"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h3>Опишите вашу историю</h3>
      <p className="input-hint">Введите краткое описание сюжета или фрагмент текста, и я помогу найти новые пути развития.</p>
      
      <textarea
        placeholder="Например: Иван отправился в лес, где встретил старого мудреца..."
        value={text}
        onChange={handleChange}
        className="story-textarea"
      />
      
      <div className="input-footer">
        <div className="input-settings">
          <span className="char-count">{text.length} символов</span>
          <div className="count-selector">
            <label htmlFor="episode-count">Кол-во серий:</label>
            <select id="episode-count" value={count} onChange={handleCountChange} disabled={isLoading}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(155, 77, 255, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onGenerate(text, count)}
          disabled={isLoading || !text.trim()}
          className="generate-button"
        >
          {isLoading ? (
            <span className="loader-container">
              <span className="loader-dot"></span>
              Генерация сценария ИИ...
            </span>
          ) : 'Создать сценарии'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default StoryInput;
