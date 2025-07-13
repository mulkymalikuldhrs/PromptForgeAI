import { useState, useEffect } from 'react';
import { FaDownload, FaTrash, FaEye, FaLock } from 'react-icons/fa';

interface PromptHistoryItem {
  id: string;
  created_at: string;
  original_prompt: string;
  enhanced_prompt: string;
  source_type: 'text' | 'url' | 'upload';
  version: string;
}

interface PromptHistoryProps {
  userId?: string;
  canExport: boolean;
}

export default function PromptHistory({ userId, canExport }: PromptHistoryProps) {
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>('all');
  
  useEffect(() => {
    if (!userId) return;
    
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        // This would be implemented to call your API
        // Simulating API call with mock data
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockHistory: PromptHistoryItem[] = [
          {
            id: '1',
            created_at: new Date().toISOString(),
            original_prompt: 'Create a chatbot that helps with customer service',
            enhanced_prompt: 'You are a helpful customer service assistant...',
            source_type: 'text',
            version: '1.0'
          },
          {
            id: '2',
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
            original_prompt: 'https://example.com/prompt.txt',
            enhanced_prompt: 'You are a creative writing assistant...',
            source_type: 'url',
            version: '1.0'
          },
          {
            id: '3',
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
            original_prompt: 'prompt.txt (uploaded)',
            enhanced_prompt: 'You are a coding assistant...',
            source_type: 'upload',
            version: '1.0'
          }
        ];
        
        setHistory(mockHistory);
      } catch (error) {
        console.error('Error fetching prompt history:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchHistory();
  }, [userId]);
  
  const handleExport = (item: PromptHistoryItem) => {
    if (!canExport) {
      alert('Exporting prompts is a premium feature. Please upgrade to use this feature.');
      return;
    }
    
    const blob = new Blob([item.enhanced_prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt_${item.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this prompt?')) {
      try {
        // This would be implemented to call your API
        await new Promise(resolve => setTimeout(resolve, 500));
        setHistory(history.filter(item => item.id !== id));
      } catch (error) {
        console.error('Error deleting prompt:', error);
        alert('Failed to delete prompt. Please try again.');
      }
    }
  };
  
  const filteredHistory = history.filter(item => {
    if (dateFilter === 'all') return true;
    
    const itemDate = new Date(item.created_at);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dateFilter === 'today') {
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return itemDate >= today && itemDate < tomorrow;
    }
    
    if (dateFilter === 'week') {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      return itemDate >= weekAgo;
    }
    
    if (dateFilter === 'month') {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      return itemDate >= monthAgo;
    }
    
    return true;
  });

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold flex items-center">
          <span className="mr-2">🔎</span> Prompt History
        </h2>
        
        <select
          className="input-field py-1 px-2 text-sm w-auto"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      ) : !userId ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>Please sign in to view your prompt history.</p>
        </div>
      ) : filteredHistory.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No prompt history found for the selected period.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
          {filteredHistory.map((item) => (
            <div 
              key={item.id}
              className="border border-gray-200 dark:border-gray-700 rounded-md p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-medium truncate max-w-[250px]">
                    {item.source_type === 'text' 
                      ? item.original_prompt.substring(0, 30) + (item.original_prompt.length > 30 ? '...' : '')
                      : item.source_type === 'url' 
                        ? 'URL: ' + item.original_prompt
                        : 'Uploaded: ' + item.original_prompt
                    }
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {new Date(item.created_at).toLocaleString()} • v{item.version}
                  </p>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={() => handleExport(item)}
                    className={`text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 p-1 ${
                      !canExport ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    title={canExport ? 'Export prompt' : 'Premium feature'}
                  >
                    {canExport ? <FaDownload /> : <FaLock />}
                  </button>
                  <button
                    className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 p-1"
                    title="View prompt"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 p-1"
                    title="Delete prompt"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                {item.enhanced_prompt.substring(0, 100)}
                {item.enhanced_prompt.length > 100 ? '...' : ''}
              </p>
            </div>
          ))}
        </div>
      )}
      
      {!canExport && userId && (
        <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
          Upgrade to Premium to export and share your prompts.
        </div>
      )}
    </div>
  );
}