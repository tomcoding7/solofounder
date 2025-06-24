'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Try to get the session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          setError(error.message);
          setTimeout(() => router.push('/login'), 2000);
          return;
        }

        if (session) {
          // If we have a session, redirect to the main page
          router.push('/');
        } else {
          // If no session, redirect back to login
          router.push('/login');
        }
      } catch (error: any) {
        console.error('Error:', error);
        setError(error.message);
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    // Check for error parameter in URL
    const params = new URLSearchParams(window.location.search);
    const errorParam = params.get('error');
    const errorDescription = params.get('error_description');

    if (errorParam) {
      setError(errorDescription || errorParam);
      setTimeout(() => router.push('/login'), 2000);
    } else {
      getSession();
    }
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center p-4">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-md">
          <p className="text-red-400 text-center">
            {error}
          </p>
          <p className="text-gray-400 text-sm text-center mt-2">
            Redirecting back to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 flex items-center justify-center">
      <div className="text-center">
        <div className="text-purple-300 text-xl mb-2">
          Completing sign in...
        </div>
        <div className="w-8 h-8 border-t-2 border-purple-500 border-solid rounded-full animate-spin mx-auto"></div>
      </div>
    </div>
  );
} 