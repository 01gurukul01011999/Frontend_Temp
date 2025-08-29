'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useAuth } from '../hooks/use-auth';

export interface GuestGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function GuestGuard({ children, fallback }: GuestGuardProps): React.ReactNode {
  const router = useRouter();
  const { user, error, isLoading, isAuthenticated } = useAuth();
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  const checkPermissions = async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    if (error) {
      setIsChecking(false);
      return;
    }

    // If user is authenticated and account is complete, redirect to dashboard
    if (isAuthenticated && user?.account_status === 'completed') {
      logger.debug('[GuestGuard]: User is logged in, redirecting to dashboard');
      router.replace(paths.dashboard.overview);
      return;
    }

    // If user is authenticated but account is incomplete, redirect to account setup
    if (isAuthenticated && user?.account_status === 'pending') {
      logger.debug('[GuestGuard]: User is logged in, redirecting to account setup');
      router.replace(paths.dashboard.account);
      return;
    }

    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions().catch(() => {
      // noop
    });
  }, [user, error, isLoading, isAuthenticated, router]);

  if (isLoading || isChecking) {
    console.log('[GuestGuard]: Loading or checking permissions...', { isLoading, isChecking });
    return fallback || (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    console.log('[GuestGuard]: Error state:', error);
    return <Alert color="error">{error}</Alert>;
  }

  if (isAuthenticated) {
    console.log('[GuestGuard]: User is authenticated, will redirect');
    return null; // Will redirect
  }

  console.log('[GuestGuard]: Rendering children (forms)');
  return <React.Fragment>{children}</React.Fragment>;
}
