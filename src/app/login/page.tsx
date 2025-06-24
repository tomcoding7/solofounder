'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

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
            theme="dark"
          />
        </div>
      </motion.div>
    </main>
  );
} 