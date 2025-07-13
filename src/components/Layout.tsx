import { ReactNode } from 'react';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';
import { FaGithub, FaUser, FaCrown, FaSignOutAlt } from 'react-icons/fa';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const user = useUser();
  const supabase = useSupabaseClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <span className="text-primary-400 mr-2">🧠</span>
            PromptForge AI
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link href="/browse" className="hover:text-primary-400 transition-colors">
              Browse Prompts
            </Link>
            <Link href="/docs" className="hover:text-primary-400 transition-colors">
              Docs
            </Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/premium" className="flex items-center text-yellow-400 hover:text-yellow-300 transition-colors">
                  <FaCrown className="mr-1" />
                  <span>Premium</span>
                </Link>
                <Link href="/account" className="flex items-center hover:text-primary-400 transition-colors">
                  <FaUser className="mr-1" />
                  <span>Account</span>
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="flex items-center hover:text-red-400 transition-colors"
                >
                  <FaSignOutAlt className="mr-1" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="bg-primary-600 hover:bg-primary-700 px-4 py-2 rounded-md transition-colors"
              >
                Sign In
              </Link>
            )}
            
            <Link 
              href="https://github.com/mulkymalikuldhrs/PromptForgeAI" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-primary-400 transition-colors"
            >
              <FaGithub size={24} />
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="bg-gray-900 text-white py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p>&copy; {new Date().getFullYear()} PromptForge AI. All rights reserved.</p>
              <p className="text-sm text-gray-400">
                Created by Mulky Malikul Dhaher
              </p>
            </div>
            <div className="flex space-x-6">
              <Link href="/privacy" className="hover:text-primary-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-primary-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-primary-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}