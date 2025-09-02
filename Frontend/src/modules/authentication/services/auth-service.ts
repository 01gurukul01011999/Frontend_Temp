'use client';

import axios, { isAxiosError } from 'axios';
import type { 
  User, 
  SignUpParams, 
  SignInParams, 
  ResetPasswordParams, 
  VerifyCodeParams, 
  NewPasswordParams, 
  ProfileParams,
  AuthResponse 
} from '../types';

class AuthService {
  private readonly baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  private readonly tokenKey = 'custom-auth-token';

  // Token Management
  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenKey);
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenKey, token);
    }
  }

  private removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
    }
  }

  // Authentication Methods
  async signUp(params: SignUpParams): Promise<{ error?: string }> {
    try {
      const response = await axios.post(`${this.baseUrl}/user`, params);
      const { token } = response.data;
      
      if (token) {
        this.setToken(token);
        return {};
      }
      
      return { error: 'No token received' };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Sign up failed' };
      }
      return { error: 'Sign up failed' };
    }
  }

  async signIn(params: SignInParams): Promise<{ error?: string }> {
    try {
      const response = await axios.post(`${this.baseUrl}/user-data`, params, {
        timeout: 10000 // 10 second timeout for sign-in
      });
      const { token } = response.data;
      
      if (token) {
        this.setToken(token);
        return {};
      }
      
      return { error: 'No token received' };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Invalid Email or Password' };
      }
      return { error: 'Invalid Email or Password' };
    }
  }

  async signOut(): Promise<{ error?: string }> {
    try {
      this.removeToken();
      return {};
    } catch (error) {
      return { error: 'Sign out failed' };
    }
  }

  // Password Management
  async resetPassword(params: ResetPasswordParams): Promise<{ error?: string }> {
    try {
      await axios.post(`${this.baseUrl}/reset`, params);
      return {};
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Password reset failed' };
      }
      return { error: 'Password reset failed' };
    }
  }

  async verifyCode(params: VerifyCodeParams): Promise<{ error?: string }> {
    try {
      await axios.post(`${this.baseUrl}/verify-code`, params);
      return {};
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Verification failed' };
      }
      return { error: 'Verification failed' };
    }
  }

  async updatePassword(params: NewPasswordParams): Promise<{ error?: string }> {
    try {
      await axios.post(`${this.baseUrl}/newPassword`, params);
      return {};
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Update password failed' };
      }
      return { error: 'Update password failed' };
    }
  }

  // Profile Management
  async updateProfile(params: ProfileParams): Promise<{ error?: string }> {
    try {
      await axios.post(`${this.baseUrl}/update_profile`, params);
      return {};
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Update data failed' };
      }
      return { error: 'Update data failed' };
    }
  }

  async updateAvatar(file: File): Promise<{ error?: string; avatar?: string }> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const token = this.getToken();
      if (!token) {
        return { error: 'No authentication token' };
      }

      const response = await axios.post(`${this.baseUrl}/upload-avatar`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      return { avatar: response.data.avatar };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        return { error: error.response?.data?.error || 'Avatar update failed' };
      }
      return { error: 'Avatar update failed' };
    }
  }

  // User Data
  async getUser(): Promise<{ data?: User | null; error?: string }> {
    try {
      const token = this.getToken();
      if (!token) {
        return { data: null };
      }

      const response = await axios.get(`${this.baseUrl}/protected`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000 // 5 second timeout to prevent hanging
      });

      if (!response.data.user || response.data.user === "Token expired") {
        await this.signOut();
        if (typeof window !== 'undefined') {
          globalThis.window.location.href = '/auth/sign-in';
        }
        return { data: null, error: 'Token expired or user not found' };
      }

      return { data: response.data.user };
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        // If unauthorized or token error, remove token and redirect
        if (error.response?.status === 401 || 
            (error.response?.data && 
             (error.response.data.error === 'Token expired' || 
              error.response.data.error === 'Unauthorized'))) {
          await this.signOut();
          if (typeof window !== 'undefined') {
            globalThis.window.location.href = '/auth/sign-in';
          }
        }
        return { error: error.response?.data?.error || 'Failed to fetch user', data: null };
      }
      return { error: 'Failed to fetch user', data: null };
    }
  }

  // Utility Methods
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}

export const authService = new AuthService();
