// Export components
export { ModernLayout } from './components/modern-layout';
export { AuthLayout } from './components/layout';
export { EnhancedSignInForm } from './components/enhanced-sign-in-form';
export { EnhancedSignUpForm } from './components/enhanced-sign-up-form';
export { ResetPasswordForm } from './components/reset-password-form';
export { HeroSection } from './components/hero-section';

// Export guards
export { AuthGuard } from './components/auth-guard';
export { GuestGuard } from './components/guest-guard';

// Export context and hooks
export { AuthProvider, useAuthContext } from './state/auth-context';
export { useAuth } from './hooks/use-auth';

// Export services
export { authService } from '@/lib/supabase/auth-service';

// Types
export type { 
  User, 
  AuthState, 
  SignInParams, 
  SignUpParams, 
  ResetPasswordParams,
  VerifyCodeParams,
  ProfileParams 
} from './types';
