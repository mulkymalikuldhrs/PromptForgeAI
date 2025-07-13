import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import Layout from '@/components/Layout';
import PromptPanel from '@/components/PromptPanel';
import PromptOutput from '@/components/PromptOutput';
import PromptEditor from '@/components/PromptEditor';
import PromptHistory from '@/components/PromptHistory';
import LoginModal from '@/components/LoginModal';
import { checkUserLimits } from '@/utils/userLimits';

export default function Home() {
  const router = useRouter();
  const user = useUser();
  const [showLogin, setShowLogin] = useState(false);
  const [userLimits, setUserLimits] = useState({
    isPremium: false,
    promptsRemaining: 5,
    canExport: false,
    canImport: false,
    canUseSandbox: false,
  });
  const [promptInput, setPromptInput] = useState('');
  const [enhancedPrompt, setEnhancedPrompt] = useState('');
  const [outputPreview, setOutputPreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      checkUserLimits(user.id).then(setUserLimits);
    }
  }, [user]);

  const handlePromptSubmit = async (input: string, type: 'text' | 'url' | 'upload') => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    if (!userLimits.isPremium && userLimits.promptsRemaining <= 0) {
      alert('You have reached your daily prompt limit. Upgrade to premium for unlimited prompts.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/analyze-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          type,
          userId: user.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze prompt');
      }

      const data = await response.json();
      setEnhancedPrompt(data.enhancedPrompt);
      setOutputPreview(data.outputPreview || '');
    } catch (error) {
      console.error('Error analyzing prompt:', error);
      alert('Failed to analyze prompt. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>PromptForge AI Specialist</title>
        <meta name="description" content="Advanced prompt engineering platform" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <div className="space-y-4">
            <PromptPanel 
              onSubmit={handlePromptSubmit} 
              isLoading={isLoading} 
              isPremium={userLimits.isPremium}
            />
            <PromptEditor 
              prompt={enhancedPrompt} 
              onChange={setEnhancedPrompt} 
              isPremium={userLimits.isPremium}
            />
          </div>
          <div className="space-y-4">
            <PromptOutput 
              enhancedPrompt={enhancedPrompt} 
              outputPreview={outputPreview} 
              canUseSandbox={userLimits.canUseSandbox}
            />
            <PromptHistory 
              userId={user?.id} 
              canExport={userLimits.canExport}
            />
          </div>
        </div>

        {showLogin && (
          <LoginModal onClose={() => setShowLogin(false)} />
        )}
      </Layout>
    </>
  );
}