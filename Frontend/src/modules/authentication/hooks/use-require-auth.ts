'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './use-auth';

export const useRequireAuth = (redirectTo: string = '/auth/sign-in') => {
  const { user, isAuthenticated, isLoading, checkSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const ensure = async () => {
      try {
        await checkSession?.({ redirectOnMissing: true });
      } catch {
        // If check fails, redirect if not authenticated
        if (!isLoading && !isAuthenticated) router.push(redirectTo);
      }
    };
    ensure();
  }, [checkSession, isLoading, isAuthenticated, redirectTo, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
  };
};
