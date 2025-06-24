'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
  signOut: async () => {},
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize Supabase client
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    console.log('AuthContext: Initializing auth state management');
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('AuthContext: Checking for existing session');
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('AuthContext: Session error:', sessionError.message);
          if (mounted) {
            setError(sessionError.message);
            setLoading(false);
          }
          return;
        }

        console.log('AuthContext: Session check complete', session ? 'User found' : 'No user');
        if (mounted) {
          setUser(session?.user ?? null);
          setLoading(false);
        }
      } catch (err) {
        console.error('AuthContext: Unexpected error during initialization:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'An unexpected error occurred');
          setLoading(false);
        }
      }
    };

    // Set up auth state change listener
    console.log('AuthContext: Setting up auth state change listener');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext: Auth state change detected:', event, session ? 'User present' : 'No user');
      
      if (mounted) {
        setUser(session?.user ?? null);
        setLoading(false);
        
        // Clear any previous errors when auth state changes successfully
        if (error) setError(null);
      }
    });

    // Initialize auth state
    initializeAuth();

    // Cleanup function
    return () => {
      console.log('AuthContext: Cleaning up auth state management');
      mounted = false;
      subscription.unsubscribe();
    };
  }, [error]); // Added error to dependencies to handle error state changes

  const signOut = async () => {
    try {
      console.log('AuthContext: Signing out user');
      setLoading(true);
      const { error: signOutError } = await supabase.auth.signOut();
      
      if (signOutError) {
        console.error('AuthContext: Sign out error:', signOutError.message);
        setError(signOutError.message);
      } else {
        console.log('AuthContext: Sign out successful');
        setUser(null);
        setError(null);
      }
    } catch (err) {
      console.error('AuthContext: Unexpected error during sign out:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during sign out');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signOut,
  };

  // Show loading state with debug information
  if (loading) {
    return (
      <AuthContext.Provider value={value}>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-t-2 border-purple-500 border-solid rounded-full animate-spin mx-auto"></div>
            <div className="text-purple-300 text-xl">
              Initializing authentication...
            </div>
            {error && (
              <div className="max-w-md mx-auto mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {error ? (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-red-500/10 border border-red-500/30 rounded-lg p-6">
            <p className="text-red-400 text-center mb-4">{error}</p>
            <button
              onClick={() => setError(null)}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}; 