import { useState } from 'react';
import { FaSave, FaHistory, FaLock } from 'react-icons/fa';

interface PromptEditorProps {
  prompt: string;
  onChange: (prompt: string) => void;
  isPremium: boolean;
}

export default function PromptEditor({ prompt, onChange, isPremium }: PromptEditorProps) {
  const [activeTab, setActiveTab] = useState<'system' | 'instruction'>('system');
  const [versions, setVersions] = useState<string[]>([]);
  
  // Split the prompt into system and instruction parts (simplified)
  const systemPart = prompt.split('\n\n')[0] || '';
  const instructionPart = prompt.split('\n\n').slice(1).join('\n\n') || '';
  
  const handleSystemChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newSystemPart = e.target.value;
    onChange(`${newSystemPart}\n\n${instructionPart}`);
  };
  
  const handleInstructionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInstructionPart = e.target.value;
    onChange(`${systemPart}\n\n${newInstructionPart}`);
  };
  
  const handleSaveVersion = () => {
    if (!isPremium) {
      alert('Saving versions is a premium feature. Please upgrade to use this feature.');
      return;
    }
    
    setVersions([...versions, prompt]);
    alert('Version saved!');
  };
  
  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <span className="mr-2">📄</span> Prompt Editor
        </h2>
        
        <div className="flex space-x-2">
          <button
            onClick={handleSaveVersion}
            disabled={!prompt || !isPremium}
            className={`btn-outline py-1 px-3 text-sm flex items-center ${
              !isPremium ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={!isPremium ? 'Premium feature' : 'Save current version'}
          >
            <FaSave className="mr-1" />
            <span>Save Version</span>
          </button>
          
          <button
            disabled={versions.length === 0 || !isPremium}
            className={`btn-outline py-1 px-3 text-sm flex items-center ${
              versions.length === 0 || !isPremium ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            title={!isPremium ? 'Premium feature' : 'View version history'}
          >
            <FaHistory className="mr-1" />
            <span>History</span>
          </button>
        </div>
      </div>
      
      <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-2 px-4 ${
            activeTab === 'system'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('system')}
        >
          System
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'instruction'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('instruction')}
        >
          Instruction
        </button>
      </div>
      
      <div className="mb-4">
        {activeTab === 'system' ? (
          <textarea
            className="textarea-field min-h-[200px]"
            value={systemPart}
            onChange={handleSystemChange}
            placeholder="System part of the prompt (defines the AI's behavior and constraints)..."
          />
        ) : (
          <textarea
            className="textarea-field min-h-[200px]"
            value={instructionPart}
            onChange={handleInstructionChange}
            placeholder="Instruction part of the prompt (specific tasks and guidelines)..."
          />
        )}
      </div>
      
      {!isPremium && (
        <div className="flex items-center text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 p-3 rounded-md">
          <FaLock className="mr-2" />
          <p className="text-sm">
            Advanced editing features are available with Premium. 
            <a href="/premium" className="underline ml-1">Upgrade now</a>
          </p>
        </div>
      )}
    </div>
  );
}