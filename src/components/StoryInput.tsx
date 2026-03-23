import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface StoryInputProps {
  onGenerate: (text: string) => void;
  isLoading: boolean;
}

const StoryInput: React.FC<StoryInputProps> = ({ onGenerate, isLoading }) => {
  const [text, setText] = useState('');

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
        onChange={(e) => setText(e.target.value)}
        className="story-textarea"
      />
      
      <div className="input-footer">
        <span className="char-count">{text.length} символов</span>
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(155, 77, 255, 0.4)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onGenerate(text)}
          disabled={isLoading || !text.trim()}
          className="generate-button"
        >
          {isLoading ? (
            <span className="loader-container">
              <span className="loader-dot"></span>
              Генерация...
            </span>
          ) : 'Создать сценарии'}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default StoryInput;
