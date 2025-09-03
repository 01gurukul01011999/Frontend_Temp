'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';

interface Profile {
  id: string;
  role: 'seller' | 'admin' | 'customer';
  account_status: 'pending' | 'completed' | 'suspended';
  is_verified: boolean;
}

export function DashboardGate({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [_profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Removed unused 'refresh' state
  const router = useRouter();
  
  // DEVELOPMENT MODE: Skip all checks for faster development
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // HARDCODED BYPASS FOR DEVELOPMENT - REMOVE IN PRODUCTION
  const forceBypass = true; // Set to false when ready for production

  useEffect(() => {
  const checkAccess = async () => {
      try {
        // HARDCODED BYPASS FOR DEVELOPMENT - REMOVE IN PRODUCTION
        if (forceBypass) {
          console.log('[DEV MODE] Force bypass enabled - skipping all checks');
          setIsLoading(false);
          return;
        }
        
        // DEVELOPMENT MODE: Skip all checks for faster development
        if (isDevelopment) {
          console.log('[DEV MODE] Bypassing all dashboard access checks');
          setIsLoading(false);
          return;
        }

        // Helper: wrap promises with a timeout so UI doesn't hang forever
        const withTimeout = async <T,>(p: Promise<T>, ms = 8000): Promise<T> => {
          return await Promise.race([p, new Promise<T>((_, rej) => setTimeout(() => rej(new Error('timeout')), ms))]);
        };

        // Get current user (with timeout)
        let user: { id: string } | null = null;
        try {
          // supabase.auth.getUser() resolves to { data: { user }, error }
          const res: { data?: { user?: { id: string } | null | undefined }, error?: unknown } = await withTimeout(supabase.auth.getUser(), 8000);
          user = res?.data?.user ?? null;
          const userError = res?.error ?? null;
          if (userError || !user) {
            router.push('/auth/sign-in');
            return;
          }
        } catch (error_) {
          // Timeout or network error
          console.error('[DashboardGate] getUser error:', error_);
          setError('Checking access timed out. Please check your network and try again.');
          setIsLoading(false);
          return;
        }

        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('id, role, account_status, is_verified')
          .eq('id', user.id)
          .single();

        if (profileError) {
          // Profile not found, redirect to sign-up
          router.push('/auth/sign-up');
          return;
        }

        setProfile(profileData);

        // Check verification status
        if (!profileData.is_verified) {
          setError('Please verify your email to access the dashboard');
          setIsLoading(false);
          return;
        }

        // Check role
        if (profileData.role !== 'seller' && profileData.role !== 'admin') {
          setError('Access denied. Seller accounts only.');
          setIsLoading(false);
          return;
        }

        // Check account status (DEVELOPMENT MODE - Skip approval check)
        if (profileData.account_status === 'suspended') {
          setError('Your account has been suspended. Please contact support.');
          setIsLoading(false);
          return;
        }

        // DEVELOPMENT MODE: Allow pending accounts to access dashboard
        // TODO: Remove this bypass when going to production
        if (profileData.account_status === 'pending') {
          console.log('[DEV MODE] Bypassing account approval check for development');
          // Allow access even with pending status
        }

        // All checks passed
        setIsLoading(false);
        
      } catch (error) {
        console.error('Dashboard gate error:', error);
        setError('An error occurred while checking access');
        setIsLoading(false);
      }
    };

  checkAccess();
  }, [router, isDevelopment, forceBypass]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Checking access...</h2>
          <p className="text-gray-600">Please wait while we verify your account.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Restricted</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/auth/sign-in')}
              className="w-full bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Sign In
            </button>

            <button
              onClick={() => router.push('/auth/sign-up')}
              className="w-full bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
            >
              Sign Up
            </button>

            {/* Retry for transient network/timeouts */}
            <button
              onClick={() => { setError(null); setIsLoading(true); }}
              className="w-full border border-blue-600 text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // All checks passed, render dashboard
  return <>{children}</>;
}
