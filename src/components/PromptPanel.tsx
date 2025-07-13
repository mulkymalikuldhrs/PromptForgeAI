import { useState, useRef } from 'react';
import { FaSearch, FaLink, FaUpload, FaMagic, FaRedo, FaChain } from 'react-icons/fa';

interface PromptPanelProps {
  onSubmit: (input: string, type: 'text' | 'url' | 'upload') => void;
  isLoading: boolean;
  isPremium: boolean;
}

export default function PromptPanel({ onSubmit, isLoading, isPremium }: PromptPanelProps) {
  const [inputType, setInputType] = useState<'text' | 'url' | 'upload'>('text');
  const [input, setInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setInput(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSubmit(input, inputType);
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className="mr-2">🧠</span> PromptForge AI Panel
      </h2>
      
      <div className="flex mb-4 space-x-2">
        <button
          type="button"
          className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
            inputType === 'text' 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
          }`}
          onClick={() => setInputType('text')}
        >
          <FaSearch className="mr-2" />
          <span>Text</span>
        </button>
        <button
          type="button"
          className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
            inputType === 'url' 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
          }`}
          onClick={() => setInputType('url')}
        >
          <FaLink className="mr-2" />
          <span>URL</span>
        </button>
        <button
          type="button"
          className={`flex-1 py-2 px-3 rounded-md flex items-center justify-center ${
            inputType === 'upload' 
              ? 'bg-primary-600 text-white' 
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'
          }`}
          onClick={() => setInputType('upload')}
        >
          <FaUpload className="mr-2" />
          <span>Upload</span>
        </button>
      </div>
      
      <form onSubmit={handleSubmit}>
        {inputType === 'text' && (
          <textarea
            className="textarea-field mb-4"
            rows={5}
            placeholder="Enter your prompt intent or raw prompt text..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        )}
        
        {inputType === 'url' && (
          <input
            type="url"
            className="input-field mb-4"
            placeholder="Enter URL to fetch prompt from..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        )}
        
        {inputType === 'upload' && (
          <div className="mb-4">
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 border-gray-300 dark:border-gray-600">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <FaUpload className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400" />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    TXT, MD, JSON, YAML (MAX. 10MB)
                  </p>
                  {fileName && (
                    <p className="mt-2 text-sm text-primary-600 dark:text-primary-400">
                      {fileName}
                    </p>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".txt,.md,.json,.yaml,.yml"
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        )}
        
        <div className="flex space-x-2">
          <button
            type="submit"
            className="btn-primary flex-1 flex items-center justify-center"
            disabled={isLoading || !input.trim()}
          >
            <FaMagic className="mr-2" />
            <span>{isLoading ? 'Analyzing...' : 'Analyze'}</span>
          </button>
          
          <button
            type="button"
            className="btn-secondary flex items-center justify-center px-4"
            disabled={isLoading || !input.trim()}
          >
            <FaRedo className="mr-2" />
            <span>Rebuild</span>
          </button>
          
          <button
            type="button"
            className="btn-outline flex items-center justify-center px-4"
            disabled={!isPremium || isLoading}
            title={!isPremium ? 'Premium feature' : 'Chain prompts together'}
          >
            <FaChain className="mr-2" />
            <span>Chain</span>
          </button>
        </div>
        
        {!isPremium && (
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Free tier: 5 prompts/day. Upgrade to Premium for unlimited access.
          </p>
        )}
      </form>
    </div>
  );
}