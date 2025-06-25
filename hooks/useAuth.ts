import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthState, User } from '@/types/auth';
import { Session } from '@supabase/supabase-js';

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthState({
        user: session?.user ? {
          id: session.user.id,
          email: session.user.email || '',
          created_at: session.user.created_at,
        } : null,
        loading: false,
        error: null,
      });
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setAuthState({
          user: session?.user ? {
            id: session.user.id,
            email: session.user.email || '',
            created_at: session.user.created_at,
          } : null,
          loading: false,
          error: null,
        });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
      return { success: false, error: error.message };
    }

    return { success: true, data };
  };

  const signUp = async (email: string, password: string) => {
    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setAuthState(prev => ({ ...prev, loading: false, error: error.message }));
      return { success: false, error: error.message };
    }

    return { success: true, data };
  };

  const signOut = async () => {
    setAuthState(prev => ({ ...prev, loading: true }));
    await supabase.auth.signOut();
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
  };
}