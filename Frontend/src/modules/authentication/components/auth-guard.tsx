'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { paths } from '@/paths';
import { logger } from '@/lib/default-logger';
import { useAuth } from '../hooks/use-auth';

export interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps): React.JSX.Element | null {
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

    if (!isAuthenticated || !user) {
      logger.debug('[AuthGuard]: User is not logged in, redirecting to sign in');
      router.replace(paths.auth.signIn);
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
    return fallback || (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  if (!isAuthenticated) {
    return null; // Will redirect
  }

  return <React.Fragment>{children}</React.Fragment>;
}
