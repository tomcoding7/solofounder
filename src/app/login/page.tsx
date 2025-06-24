'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { motion } from 'framer-motion';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/contexts/AuthContext';
import { Provider } from '@supabase/supabase-js';

export default function Login() {
  const router = useRouter();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string>('');

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    // Set the redirect URL based on the environment
    const host = window.location.origin;
    setRedirectUrl(`${host}/auth/callback`);
  }, []);

  useEffect(() => {
    if (user) {
      router.push('/');
    } else {
      // If we know there's no user, we can show the login form
      setIsLoading(false);
    }
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
        <div className="text-purple-300 text-xl animate-pulse">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-black/30 backdrop-blur-md rounded-lg p-8 border border-purple-500/30">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-orbitron text-purple-300 mb-2">
              Solo Founder System
            </h1>
            <p className="text-gray-400">
              Level up your founder journey
            </p>
          </div>

          {error ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          ) : (
            <Auth
              supabaseClient={supabase}
              appearance={{
                theme: ThemeSupa,
                variables: {
                  default: {
                    colors: {
                      brand: '#9333ea',
                      brandAccent: '#a855f7',
                    },
                  },
                },
                className: {
                  container: 'supabase-auth-container',
                  button: 'supabase-auth-button',
                  input: 'supabase-auth-input',
                },
              }}
              providers={['google']}
              view="magic_link"
              showLinks={true}
              redirectTo={redirectUrl}
              theme="dark"
            />
          )}
        </div>
      </motion.div>
    </main>
  );
} 