'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

export default function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the access_token and refresh_token from URL params
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          setStatus('error');
          setMessage(errorDescription || 'Authentication failed');
          return;
        }

        if (accessToken && refreshToken) {
          // Set the session
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (sessionError) {
            throw sessionError;
          }

          // Get the current user
          const { data: { user }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !user) {
            throw userError || new Error('Failed to get user');
          }

          // Check if user profile exists
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, account_status, is_verified')
            .eq('id', user.id)
            .single();

          if (profileError) {
            // Profile might not exist yet due to timing, wait a bit and retry
            setTimeout(async () => {
              const { data: retryProfile } = await supabase
                .from('profiles')
                .select('role, account_status, is_verified')
                .eq('id', user.id)
                .single();

              if (retryProfile) {
                setStatus('success');
                setMessage('Account verified successfully! Redirecting to dashboard...');
                setTimeout(() => router.push('/dashboard'), 2000);
              } else {
                setStatus('error');
                setMessage('Profile setup incomplete. Please contact support.');
              }
            }, 2000);
            return;
          }

          setStatus('success');
          setMessage('Account verified successfully! Redirecting to dashboard...');
          setTimeout(() => router.push('/dashboard'), 2000);
        } else {
          setStatus('error');
          setMessage('Invalid callback parameters');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'Authentication failed');
      }
    };

    handleCallback();
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying your account...</h2>
          <p className="text-gray-600">Please wait while we complete the setup.</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-600 text-6xl mb-4">✗</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification Failed</h2>
          <p className="text-gray-600 mb-6">{message}</p>
          <button
            onClick={() => router.push('/auth/sign-in')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Account Verified!</h2>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
