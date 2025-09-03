'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import type { User, AuthState, ProfileParams } from '../types';
import { authService } from '@/lib/supabase/auth-service';
import { logger } from '@/lib/default-logger';

export interface AuthContextValue extends AuthState {
  checkSession?: (opts?: { redirectOnMissing?: boolean }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signUp: (firstName: string, lastName: string, email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ error?: string }>;
  updateProfile: (userId: string, params: unknown) => Promise<{ error?: string }>;
}

export const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

export interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<AuthState>({
    user: null,
    error: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const router = useRouter();

  const checkSession = React.useCallback(async (opts?: { redirectOnMissing?: boolean }): Promise<void> => {
    try {
      console.log('[AuthContext]: Checking session...');
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const { user, error } = await authService.getCurrentUser();
      console.log('[AuthContext]: Session check result:', { user: !!user, error });
      
      if (error) {
        logger.error(error);
        setState(prev => ({ 
          ...prev, 
          user: null, 
          error: null, // Don't show error on mount
          isLoading: false, 
          isAuthenticated: false 
        }));
        // Redirect to sign-in if requested (for protected pages)
        if (opts?.redirectOnMissing) {
          try { router.push('/auth/sign-in'); } catch { /* ignore */ }
        }
        return;
      }

      setState(prev => ({ 
        ...prev, 
        user: (user ?? null) as User | null, 
        error: null, 
        isLoading: false, 
        isAuthenticated: !!user 
      }));
      // If no user and caller asked to redirect, send them to sign-in
      if (!user && opts?.redirectOnMissing) {
        try { router.push('/auth/sign-in'); } catch { /* ignore */ }
      }
  } catch (error) {
      logger.error(error);
      setState(prev => ({ 
        ...prev, 
        user: null, 
        error: null, // Don't show error on mount
        isLoading: false, 
        isAuthenticated: false 
      }));
      if (opts?.redirectOnMissing) {
    try { router.push('/auth/sign-in'); } catch { /* ignore */ }
      }
    }
  }, [router]);

  const signIn = React.useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { error } = await authService.signIn({ email, password });
      
      if (error) {
        setState(prev => ({ ...prev, error, isLoading: false }));
        return { error };
      }

      // Refresh the auth state
      await checkSession();
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return { error: errorMessage };
    }
  }, [checkSession]);

  const signUp = React.useCallback(async (firstName: string, lastName: string, email: string, password: string): Promise<{ error?: string }> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const { error } = await authService.signUp({ firstName, lastName, email, password });
      
      if (error) {
        setState(prev => ({ ...prev, error, isLoading: false }));
        return { error };
      }

      // Refresh the auth state
      await checkSession();
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      return { error: errorMessage };
    }
  }, [checkSession]);

  const signOut = React.useCallback(async (): Promise<void> => {
    try {
      await authService.signOut();
      setState({
        user: null,
        error: null,
        isLoading: false,
        isAuthenticated: false,
      });
      router.push('/auth/sign-in');
    } catch (error) {
      logger.error('Sign out error:', error);
    }
  }, [router]);

  const resetPassword = React.useCallback(async (email: string): Promise<{ error?: string }> => {
    try {
      const { error } = await authService.resetPassword(email);
      return { error };
    } catch {
      return { error: 'Password reset failed' };
    }
  }, []);



  const updatePassword = React.useCallback(async (newPassword: string): Promise<{ error?: string }> => {
    try {
      const { error } = await authService.updatePassword(newPassword);
      return { error };
    } catch {
      return { error: 'Password update failed' };
    }
  }, []);

  const updateProfile = React.useCallback(async (userId: string, params: unknown): Promise<{ error?: string }> => {
    try {
  const { error } = await authService.updateProfile(userId, params as ProfileParams);
      if (!error) {
        // Refresh user data after profile update
        await checkSession();
      }
      return { error };
    } catch {
      return { error: 'Profile update failed' };
    }
  }, [checkSession]);



  React.useEffect(() => {
    // Check Supabase session on mount with a small delay to allow components to render
    const timer = setTimeout(() => {
      checkSession().catch((error) => {
        logger.error(error);
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [checkSession]);

  const contextValue: AuthContextValue = {
    ...state,
    checkSession,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    updateProfile,
  };

  // Redirect to sign-in for protected routes when session is missing.
  React.useEffect(() => {
    try {
      const pathname = globalThis?.location?.pathname ?? '';
      // Skip redirect for auth pages and public root
      const isAuthPage = pathname.startsWith('/auth');
      const isPublicRoot = pathname === '/';
      if (!state.isLoading && !state.isAuthenticated && !isAuthPage && !isPublicRoot) {
        try { router.push('/auth/sign-in'); } catch { /* ignore */ }
      }
    } catch {
      // ignore
    }
  }, [state.isLoading, state.isAuthenticated, router]);

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export const useAuthContext = (): AuthContextValue => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};
