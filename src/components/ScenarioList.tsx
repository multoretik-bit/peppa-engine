import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
import { Scenario } from '../types';

interface ScenarioListProps {
  scenarios: Scenario[];
}

const ScenarioList: React.FC<ScenarioListProps> = ({ scenarios }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (scenario: Scenario): void => {
    const text: string = `${scenario.title}\n\n${scenario.description}\n\nШаги:\n${scenario.steps.map(s => `- ${s}`).join('\n')}\n\nИтог: ${scenario.outcome}`;
    navigator.clipboard.writeText(text);
    setCopiedId(scenario.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="scenario-list">
      <AnimatePresence>
        {scenarios.map((scenario, index) => (
          <motion.div
            key={scenario.id}
            className="scenario-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
          >
            <div className="scenario-card-header">
              <h3>{scenario.title}</h3>
              <button 
                className="copy-button" 
                onClick={() => copyToClipboard(scenario)}
                title="Копировать сценарий"
              >
                {copiedId === scenario.id ? <Check size={18} color="#00ff88" /> : <Copy size={18} />}
              </button>
            </div>
            
            <p className="scenario-desc">{scenario.description}</p>
            
            <div className="scenario-content">
              <h4>План действий:</h4>
              <ul className="scenario-steps">
                {scenario.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="scenario-outcome">
              <span className="outcome-label">Ожидаемый результат:</span>
              <p>{scenario.outcome}</p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ScenarioList;
