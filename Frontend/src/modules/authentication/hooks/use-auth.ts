'use client';

import { useAuthContext } from '../state/auth-context';

export const useAuth = () => {
  const context = useAuthContext();
  
  return {
    // User state
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    error: context.error,
    
    // Authentication methods
    signIn: context.signIn,
    signUp: context.signUp,
    signOut: context.signOut,
    
    // Password management
    resetPassword: context.resetPassword,
    updatePassword: context.updatePassword,
    
    // Profile management
    updateProfile: context.updateProfile,
    
    // Session management
    checkSession: context.checkSession,
  };
};
