import { useState, useEffect } from 'react';
import { 
  FaPlay, 
  FaDownload, 
  FaShare, 
  FaCopy, 
  FaCode, 
  FaRobot, 
  FaCheck, 
  FaCrown,
  FaExclamationTriangle,
  FaSpinner,
  FaFileExport,
  FaLink
} from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

interface PromptOutputProps {
  enhancedPrompt: string;
  outputPreview: string;
  canUseSandbox: boolean;
}

export default function PromptOutput({ enhancedPrompt, outputPreview, canUseSandbox }: PromptOutputProps) {
  const [activeTab, setActiveTab] = useState<'prompt' | 'output'>('prompt');
  const [isRunning, setIsRunning] = useState(false);
  const [copySuccess, setCopySuccess] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('gpt-3.5-turbo');
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  
  const handleCopyToClipboard = (text: string, type: 'prompt' | 'output') => {
    if (!text) return;
    
    navigator.clipboard.writeText(text);
    setCopySuccess(type);
    
    setTimeout(() => {
      setCopySuccess(null);
    }, 2000);
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

  const handleExport = (format: 'txt' | 'json' | 'md' | 'yaml') => {
    if (!enhancedPrompt) return;
    
    let content = enhancedPrompt;
    let mimeType = 'text/plain';
    let extension = 'txt';
    
    if (format === 'json') {
      content = JSON.stringify({
        prompt: enhancedPrompt,
        output: outputPreview,
        timestamp: new Date().toISOString(),
        model: selectedModel
      }, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else if (format === 'md') {
      content = `# Enhanced Prompt\n\n${enhancedPrompt}\n\n${outputPreview ? `# Output Preview\n\n${outputPreview}` : ''}`;
      mimeType = 'text/markdown';
      extension = 'md';
    } else if (format === 'yaml') {
      content = `prompt: |\n  ${enhancedPrompt.split('\n').join('\n  ')}\n${outputPreview ? `output: |\n  ${outputPreview.split('\n').join('\n  ')}` : ''}\ntimestamp: ${new Date().toISOString()}\nmodel: ${selectedModel}`;
      mimeType = 'application/x-yaml';
      extension = 'yaml';
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptforge_${new Date().toISOString().slice(0, 10)}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportOptions(false);
  };

  const handleShare = (method: 'link' | 'email' | 'twitter') => {
    if (!enhancedPrompt) return;
    
    if (method === 'link') {
      // In a real app, this would create a shareable link
      alert('Shareable link created and copied to clipboard!');
    } else if (method === 'email') {
      const subject = encodeURIComponent('Check out this prompt from PromptForge AI');
      const body = encodeURIComponent(`I created this prompt with PromptForge AI:\n\n${enhancedPrompt}`);
      window.open(`mailto:?subject=${subject}&body=${body}`);
    } else if (method === 'twitter') {
      const text = encodeURIComponent('Check out this prompt I created with PromptForge AI! #PromptForgeAI #AIPrompts');
      window.open(`https://twitter.com/intent/tweet?text=${text}`);
    }
    
    setShowShareOptions(false);
  };

  // Close dropdown menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowExportOptions(false);
      setShowShareOptions(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center text-gray-900 dark:text-white">
          <span className="text-primary-500 dark:text-primary-400 mr-2 text-2xl">📊</span>
          <span className="bg-gradient-to-r from-primary-600 to-secondary-500 bg-clip-text text-transparent">
            Prompt Output View
          </span>
        </h2>
        
        {enhancedPrompt && (
          <div className="flex items-center">
            <select
              className="text-sm border border-gray-300 dark:border-gray-600 rounded-lg py-1 px-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 mr-2"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="claude-3-sonnet">Claude 3 Sonnet</option>
              <option value="claude-3-opus">Claude 3 Opus</option>
              <option value="gemini-pro">Gemini Pro</option>
              <option value="llama-3-70b">Llama 3 70B</option>
            </select>
          </div>
        )}
      </div>
      
      <div className="flex mb-6 border-b border-gray-200 dark:border-gray-700">
        <button
          className={`py-2 px-4 font-medium text-sm flex items-center ${
            activeTab === 'prompt'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('prompt')}
        >
          <FaCode className="mr-2" />
          Enhanced Prompt
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm flex items-center ${
            activeTab === 'output'
              ? 'border-b-2 border-primary-500 text-primary-600 dark:text-primary-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
          }`}
          onClick={() => setActiveTab('output')}
        >
          <FaRobot className="mr-2" />
          Test Output
        </button>
      </div>
      
      <div className="mb-6">
        {activeTab === 'prompt' ? (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5 min-h-[350px] max-h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700 prose prose-sm dark:prose-invert max-w-none">
            {enhancedPrompt ? (
              <ReactMarkdown>{enhancedPrompt}</ReactMarkdown>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                  <FaCode className="text-gray-400 dark:text-gray-500 text-3xl" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  Enhanced prompt will appear here
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm max-w-md">
                  Enter your prompt intent or raw prompt in the panel on the left and click "Analyze" to generate an enhanced version.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5 min-h-[350px] max-h-[500px] overflow-y-auto border border-gray-200 dark:border-gray-700 prose prose-sm dark:prose-invert max-w-none">
            {outputPreview ? (
              <ReactMarkdown>{outputPreview}</ReactMarkdown>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-full mb-4">
                  <FaRobot className="text-gray-400 dark:text-gray-500 text-3xl" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  Test output will appear here
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm max-w-md">
                  {enhancedPrompt 
                    ? `Click "Test in Sandbox" to see how the AI would respond to your enhanced prompt.${!canUseSandbox ? ' (Premium feature)' : ''}`
                    : 'First generate an enhanced prompt, then test it in the sandbox to see the AI response.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleRunInSandbox}
          disabled={!enhancedPrompt || isRunning}
          className={`py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center transition-colors ${
            !enhancedPrompt || isRunning
              ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
              : canUseSandbox
                ? 'bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
          }`}
        >
          {isRunning ? (
            <FaSpinner className="mr-2 animate-spin" />
          ) : (
            <FaPlay className="mr-2" />
          )}
          <span>{isRunning ? 'Running...' : 'Test in Sandbox'}</span>
          {!canUseSandbox && (
            <span className="ml-1 text-yellow-500 dark:text-yellow-400">
              <FaCrown size={12} />
            </span>
          )}
        </button>
        
        <button
          onClick={() => handleCopyToClipboard(activeTab === 'prompt' ? enhancedPrompt : outputPreview, activeTab)}
          disabled={activeTab === 'prompt' ? !enhancedPrompt : !outputPreview}
          className={`py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center transition-colors ${
            (activeTab === 'prompt' ? !enhancedPrompt : !outputPreview)
              ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
          }`}
        >
          {copySuccess === activeTab ? (
            <FaCheck className="mr-2 text-green-500" />
          ) : (
            <FaCopy className="mr-2" />
          )}
          <span>{copySuccess === activeTab ? 'Copied!' : 'Copy'}</span>
        </button>
        
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowExportOptions(!showExportOptions);
              setShowShareOptions(false);
            }}
            disabled={!enhancedPrompt}
            className={`py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center transition-colors ${
              !enhancedPrompt
                ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            <FaFileExport className="mr-2" />
            <span>Export</span>
          </button>
          
          {showExportOptions && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleExport('txt')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Export as TXT
                </button>
                <button
                  onClick={() => handleExport('json')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Export as JSON
                </button>
                <button
                  onClick={() => handleExport('md')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Export as Markdown
                </button>
                <button
                  onClick={() => handleExport('yaml')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Export as YAML
                </button>
              </div>
            </div>
          )}
        </div>
        
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowShareOptions(!showShareOptions);
              setShowExportOptions(false);
            }}
            disabled={!enhancedPrompt}
            className={`py-2.5 px-4 rounded-lg font-medium text-sm flex items-center justify-center transition-colors ${
              !enhancedPrompt
                ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
            }`}
          >
            <FaShare className="mr-2" />
            <span>Share</span>
          </button>
          
          {showShareOptions && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
              <div className="py-1" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleShare('link')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <FaLink className="inline mr-2" />
                  Copy Shareable Link
                </button>
                <button
                  onClick={() => handleShare('email')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="inline mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                  Share via Email
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="inline mr-2 w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                  Share on Twitter
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {!canUseSandbox && enhancedPrompt && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start">
          <FaExclamationTriangle className="text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
          <div>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">Sandbox testing is a premium feature</p>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
              <a href="/premium" className="underline font-medium">Upgrade to Premium</a> to test your prompts with different AI models and see real-time responses.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}