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
    isLoading: false, // Start with false for instant rendering
  });

  const router = useRouter();
  
  const checkSession = React.useCallback(async (): Promise<void> => {
    try {
      // Only show loading if we don't have cached data in storage
      let hasCached = false;
      if (typeof globalThis !== 'undefined' && globalThis.window) {
        hasCached = !!(localStorage.getItem('cached-user-profile') || sessionStorage.getItem('cached-user-profile'));
      }
      if (!hasCached) {
        setState(prev => ({ ...prev, isLoading: true, error: null }));
      }

      // Get current Supabase session
      const { session, error: sessionError } = await authService.getSession();
      const supSession = session as { user?: { id: string } } | undefined;
      
      if (sessionError) {
        logger.error('Session error:', sessionError);
        setState(prev => ({ 
          ...prev, 
          user: null, 
          error: 'Session expired', 
          isLoading: false 
        }));
        localStorage.removeItem('cached-user-profile');
        router.push('/auth/sign-in');
        return;
      }

      if (!supSession?.user) {
        setState(prev => ({ 
          ...prev, 
          user: null, 
          error: null, 
          isLoading: false 
        }));
        localStorage.removeItem('cached-user-profile');
        return;
      }

      // Get user profile from profiles table
      const { profile, error: profileError } = await authService.getUserProfile(supSession.user.id);
      
      if (profileError) {
        logger.error('Profile fetch error:', profileError);
        setState(prev => ({ 
          ...prev, 
          user: null, 
          error: 'Failed to load profile', 
          isLoading: false 
        }));
        localStorage.removeItem('cached-user-profile');
        return;
      }

      // Cache the user profile for instant future access
      if (profile && globalThis.window) {
        localStorage.setItem('cached-user-profile', JSON.stringify(profile));
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
      localStorage.removeItem('cached-user-profile');
    }
  }, [router]);

  // Load cached user data immediately from localStorage
  React.useEffect(() => {
    try {
      if (globalThis.window) {
        const cachedUser = localStorage.getItem('cached-user-profile');
        if (cachedUser) {
          const parsedUser = JSON.parse(cachedUser);
          setState(prev => ({ 
            ...prev, 
            user: parsedUser, 
            isLoading: false 
          }));
          
          // Start background refresh without blocking UI
          setTimeout(() => {
            checkSession();
          }, 100);
        }
      }
    } catch (error) {
      console.warn('Failed to load cached user data:', error);
    }
  }, [checkSession]);

  // (duplicate removed)

  const signOut = React.useCallback(async (): Promise<void> => {
    try {
      const { error } = await authService.signOut();
      if (error) {
        logger.error('Sign out error:', error);
      }
      
      // Clear cached data
      localStorage.removeItem('cached-user-profile');
      
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
      const supSession = session as { user?: { id: string } } | undefined;
      if (event === 'SIGNED_IN' && supSession?.user) {
        await checkSession();
      } else if (event === 'SIGNED_OUT') {
        localStorage.removeItem('cached-user-profile');
        setState(prev => ({ 
          ...prev, 
          user: null, 
          error: null, 
          isLoading: false 
        }));
      }
    });

    // Initial session check (only if no cached data)
    if (!state.user) {
      checkSession().catch((error) => {
        logger.error('Initial session check error:', error);
      });
    }

    // Cleanup subscription
    return () => subscription.unsubscribe();
  }, [checkSession, state.user]);

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
