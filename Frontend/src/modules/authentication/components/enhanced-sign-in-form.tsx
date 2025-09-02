'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { getNetworkErrorMessage } from '@/lib/network-health';
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, type SignInData } from '@/lib/validations/auth';

export function EnhancedSignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpToken, setOtpToken] = useState('');
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
  });

  const email = watch('email');

  const handlePasswordSignIn = async (data: SignInData) => {
    try {
      setIsLoading(true);
      
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 15000); // 15 seconds
      });
      
      const signInPromise = supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      
      const result = await Promise.race([signInPromise, timeoutPromise]);
      
      if ('error' in result && result.error) {
        toast.error(result.error.message);
        return;
      }

      toast.success('Signed in successfully!');
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error('Sign-in error:', error);
      toast.error(getNetworkErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSignIn = async (data: SignInData) => {
    try {
      setIsLoading(true);
      
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 15000); // 15 seconds
      });
      
      const otpPromise = supabase.auth.signInWithOtp({
        email: data.email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      
      const result = await Promise.race([otpPromise, timeoutPromise]);
      
      if ('error' in result && result.error) {
        toast.error(result.error.message);
        return;
      }

      setOtpSent(true);
      toast.success('OTP sent to your email!');
      
    } catch (error: any) {
      console.error('OTP sign-in error:', error);
      toast.error(getNetworkErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpVerify = async (otp: string) => {
    try {
      setIsLoading(true);
      
      // Add timeout to prevent hanging requests
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Request timeout')), 15000); // 15 seconds
      });
      
      const verifyPromise = supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      });
      
      const result = await Promise.race([verifyPromise, timeoutPromise]);
      
      if ('error' in result && result.error) {
        toast.error(result.error.message);
        return;
      }

      toast.success('Signed in successfully!');
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast.error(getNetworkErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  };

  if (otpSent) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-medium mb-2">Enter OTP</h3>
          <p className="text-gray-600">
            We've sent a one-time password to {email}
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otpToken}
            onChange={(e) => setOtpToken(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={6}
          />

          <button
            onClick={() => handleOtpVerify(otpToken)}
            disabled={isLoading || otpToken.length !== 6}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>

          <button
            onClick={() => {
              setOtpSent(false);
              setOtpToken('');
            }}
            className="w-full text-gray-600 hover:text-gray-800"
          >
            Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2 mb-4">
        <button
          onClick={() => setIsOtpMode(false)}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            !isOtpMode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Password
        </button>
        <button
          onClick={() => setIsOtpMode(true)}
          className={`flex-1 py-2 px-4 rounded-md transition-colors ${
            isOtpMode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          OTP
        </button>
      </div>

      <form onSubmit={handleSubmit(isOtpMode ? handleOtpSignIn : handlePasswordSignIn)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            {...register('email')}
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        {!isOtpMode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              {...register('password')}
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading 
            ? (isOtpMode ? 'Sending OTP...' : 'Signing in...') 
            : (isOtpMode ? 'Send OTP' : 'Sign In')
          }
        </button>

        {!isOtpMode && (
          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push('/auth/reset-password')}
              className="text-blue-600 hover:underline text-sm"
            >
              Forgot your password?
            </button>
          </div>
        )}
      </form>

      <div className="border-t pt-4">
        <p className="text-sm text-gray-600 text-center">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => router.push('/auth/sign-up')}
            className="text-blue-600 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
