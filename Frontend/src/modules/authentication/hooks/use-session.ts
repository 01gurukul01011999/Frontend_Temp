'use client';

import { useAuthContext } from '../state/auth-context';

export const useSession = () => {
  const context = useAuthContext();
  
  return {
    // Session state
    user: context.user,
    isAuthenticated: context.isAuthenticated,
    isLoading: context.isLoading,
    
    // Session management
    checkSession: context.checkSession,
    
    // Utility methods
  hasRole: (role: string) => context.user?.role === role,
    hasPermission: (_permission: string) => {
      // Add permission logic here based on your requirements
      return context.isAuthenticated;
    },
  };
};
