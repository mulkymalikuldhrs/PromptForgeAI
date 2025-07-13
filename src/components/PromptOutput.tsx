import { useState } from 'react';
import { FaPlay, FaDownload, FaShare, FaCopy } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

interface PromptOutputProps {
  enhancedPrompt: string;
  outputPreview: string;
  canUseSandbox: boolean;
}

export default function PromptOutput({ enhancedPrompt, outputPreview, canUseSandbox }: PromptOutputProps) {
  const [activeTab, setActiveTab] = useState<'prompt' | 'output'>('prompt');
  const [isRunning, setIsRunning] = useState(false);
  
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };
  
  const handleRunInSandbox = async () => {
    if (!canUseSandbox) {
      alert('Sandbox testing is a premium feature. Please upgrade to use this feature.');
      return;
    }
    
    setIsRunning(true);
    try {
      // This would be implemented to call your sandbox API
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulating API call
      setActiveTab('output');
    } catch (error) {
      console.error('Error running in sandbox:', error);
      alert('Failed to run in sandbox. Please try again.');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <span className="mr-2">📊</span> Prompt Output View
      </h2>
      
      <div className="flex mb-4 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-2 px-4 ${
            activeTab === 'prompt'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('prompt')}
        >
          Enhanced Prompt
        </button>
        <button
          className={`py-2 px-4 ${
            activeTab === 'output'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('output')}
        >
          Test Output
        </button>
      </div>
      
      <div className="mb-4">
        {activeTab === 'prompt' ? (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
            {enhancedPrompt ? (
              <ReactMarkdown>{enhancedPrompt}</ReactMarkdown>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                Enhanced prompt will appear here after analysis.
              </p>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
            {outputPreview ? (
              <ReactMarkdown>{outputPreview}</ReactMarkdown>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 italic">
                Test output will appear here after running in sandbox.
              </p>
            )}
          </div>
        )}
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={handleRunInSandbox}
          disabled={!enhancedPrompt || isRunning}
          className={`btn-primary flex items-center justify-center ${
            !canUseSandbox ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <FaPlay className="mr-2" />
          <span>{isRunning ? 'Running...' : 'Test in Sandbox'}</span>
        </button>
        
        <button
          onClick={() => handleCopyToClipboard(activeTab === 'prompt' ? enhancedPrompt : outputPreview)}
          disabled={activeTab === 'prompt' ? !enhancedPrompt : !outputPreview}
          className="btn-outline flex items-center justify-center"
        >
          <FaCopy className="mr-2" />
          <span>Copy</span>
        </button>
        
        <button
          disabled={!enhancedPrompt}
          className="btn-outline flex items-center justify-center"
        >
          <FaDownload className="mr-2" />
          <span>Export</span>
        </button>
        
        <button
          disabled={!enhancedPrompt}
          className="btn-outline flex items-center justify-center"
        >
          <FaShare className="mr-2" />
          <span>Share</span>
        </button>
      </div>
      
      {!canUseSandbox && (
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Sandbox testing is a premium feature. Upgrade to test your prompts.
        </p>
      )}
    </div>
  );
}