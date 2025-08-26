'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import type { Profile } from '@/lib/supabase/types';
import { authService } from '@/lib/supabase/auth-service';
import { logger } from '@/lib/default-logger';

export interface UserContextValue {
  user: Profile | null;
  error: string | null;
  isLoading: boolean;
  checkSession?: () => Promise<void>;
  signOut?: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider({ children }: UserProviderProps): React.JSX.Element {
  const [state, setState] = React.useState<{ 
    user: Profile | null; 
    error: string | null; 
    isLoading: boolean 
  }>({
    user: null,
    error: null,
    isLoading: true,
  });

  const router = useRouter();

  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Get current Supabase session
      const { session, error: sessionError } = await authService.getSession();
      
      if (sessionError) {
        logger.error('Session error:', sessionError);
        setState(prev => ({ 
          ...prev, 
          user: null, 
          error: 'Session expired', 
          isLoading: false 
        }));
        router.push('/auth/sign-in');
        return;
      }

      if (!session?.user) {
        setState(prev => ({ 
          ...prev, 
          user: null, 
          error: null, 
          isLoading: false 
        }));
        return;
      }

      // Get user profile from profiles table
      const { profile, error: profileError } = await authService.getUserProfile(session.user.id);
      
      if (profileError) {
        logger.error('Profile fetch error:', profileError);
        setState(prev => ({ 
          ...prev, 
          user: null, 
          error: 'Failed to load profile', 
          isLoading: false 
        }));
        return;
      }

      setState(prev => ({ 
        ...prev, 
        user: profile || null, 
        error: null, 
        isLoading: false 
      }));
    } catch (error) {
      logger.error('Session check error:', error);
      setState(prev => ({ 
        ...prev, 
        user: null, 
        error: 'Something went wrong', 
        isLoading: false 
      }));
    }
  }, [router]);

  const signOut = React.useCallback(async (): Promise<void> => {
    try {
      const { error } = await authService.signOut();
      if (error) {
        logger.error('Sign out error:', error);
      }
      
      setState(prev => ({ 
        ...prev, 
        user: null, 
        error: null, 
        isLoading: false 
      }));
      
      router.push('/auth/sign-in');
    } catch (error) {
      logger.error('Sign out error:', error);
    }
  }, [router]);

  React.useEffect(() => {
    // Set up auth state change listener
    const { data: { subscription } } = authService.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await checkSession();
      } else if (event === 'SIGNED_OUT') {
        setState(prev => ({ 
          ...prev, 
          user: null, 
          error: null, 
          isLoading: false 
        }));
      }
    });

    // Initial session check
    checkSession().catch((error) => {
      logger.error('Initial session check error:', error);
    });

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [checkSession]);

  return (
    <UserContext.Provider value={{ 
      ...state, 
      checkSession, 
      signOut 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const UserConsumer = UserContext.Consumer;
