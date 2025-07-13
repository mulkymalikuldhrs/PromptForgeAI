import { createClient } from '@supabase/supabase-js';

// This would be properly initialized in a real app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserLimits {
  isPremium: boolean;
  promptsRemaining: number;
  canExport: boolean;
  canImport: boolean;
  canUseSandbox: boolean;
}

export async function checkUserLimits(userId: string): Promise<UserLimits> {
  try {
    // In a real app, this would fetch from your database
    // For demo purposes, we're returning mock data
    
    // Fetch user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('premium_status, prompt_count')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    const isPremium = userData?.premium_status !== 'FREE';
    const promptsUsedToday = userData?.prompt_count || 0;
    const promptsRemaining = isPremium ? Infinity : Math.max(0, 5 - promptsUsedToday);
    
    return {
      isPremium,
      promptsRemaining,
      canExport: isPremium,
      canImport: isPremium,
      canUseSandbox: isPremium,
    };
  } catch (error) {
    console.error('Error checking user limits:', error);
    
    // Return default free tier limits if there's an error
    return {
      isPremium: false,
      promptsRemaining: 5,
      canExport: false,
      canImport: false,
      canUseSandbox: false,
    };
  }
}

export async function incrementPromptCount(userId: string): Promise<void> {
  try {
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('prompt_count')
      .eq('id', userId)
      .single();
    
    if (userError) throw userError;
    
    const currentCount = userData?.prompt_count || 0;
    
    const { error: updateError } = await supabase
      .from('users')
      .update({ prompt_count: currentCount + 1 })
      .eq('id', userId);
    
    if (updateError) throw updateError;
  } catch (error) {
    console.error('Error incrementing prompt count:', error);
  }
}