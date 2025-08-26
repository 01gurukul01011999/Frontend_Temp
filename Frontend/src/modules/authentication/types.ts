// Authentication Module Types

export interface User {
  id: string;
  email?: string;
  fname?: string;
  lname?: string;
  phone?: string;
  address?: string;
  state?: string;
  city?: string;
  pincode?: string;
  ac_sta?: string;
  roll?: string;
  avatar?: string;
  [key: string]: unknown;
}

export interface AuthState {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface VerifyCodeParams {
  email: string;
  code: string;
}

export interface ResetPasswordParams {
  email: string;
}

export interface NewPasswordParams {
  email: string;
  newPassword: string;
}

export interface ProfileParams {
  email: string;
  phone: string;
  address: string;
  state: string;
  city: string;
  pincode: string;
}

export interface AuthResponse {
  token?: string;
  user?: User;
  error?: string;
  message?: string;
}

export interface TokenPayload {
  email: string;
  fname: string;
  lname: string;
  id: string;
  iat: number;
  exp: number;
}
