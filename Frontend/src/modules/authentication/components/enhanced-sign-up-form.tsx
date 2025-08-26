'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { supabase } from '@/lib/supabase/client';
import { signUpSchema, type SignUpData } from '@/lib/validations/auth';
import { env } from '@/lib/env';

export function EnhancedSignUpForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      country: 'IN',
      is_default: true,
    },
  });

  const onSubmit = async (data: SignUpData) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: `${env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
          data: {
            first_name: data.first_name,
            last_name: data.last_name,
            phone: data.phone,
            business_name: data.business_name,
            gst_number: data.gst_number,
            role: 'seller',
            account_status: 'pending',
            address: {
              label: data.address.label,
              line1: data.address.line1,
              line2: data.address.line2,
              state: data.address.state,
              city: data.address.city,
              pincode: data.address.pincode,
              country: data.address.country,
              is_default: data.address.is_default,
            },
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return;
      }

      setIsSuccess(true);
      reset();
      toast.success('Check your email to confirm your account!');
      
    } catch (error) {
      console.error('Sign-up error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center p-6">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
        <p className="text-gray-600 mb-4">
          We've sent you a confirmation link. Click it to activate your account.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="text-blue-600 hover:underline"
        >
          Sign up another account
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name *
          </label>
          <input
            {...register('first_name')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="John"
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name *
          </label>
          <input
            {...register('last_name')}
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Doe"
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
          )}
        </div>
      </div>

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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password *
        </label>
        <input
          {...register('password')}
          type="password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Minimum 10 characters"
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phone *
        </label>
        <input
          {...register('phone')}
          type="tel"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="+911234567890"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Business Name *
        </label>
        <input
          {...register('business_name')}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Your Business Name"
        />
        {errors.business_name && (
          <p className="text-red-500 text-sm mt-1">{errors.business_name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          GST Number *
        </label>
        <input
          {...register('gst_number')}
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="22AAAAA0000A1Z5"
        />
        {errors.gst_number && (
          <p className="text-red-500 text-sm mt-1">{errors.gst_number.message}</p>
        )}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-medium mb-3">Business Address</h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 1 *
            </label>
            <input
              {...register('address.line1')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Street address"
            />
            {errors.address?.line1 && (
              <p className="text-red-500 text-sm mt-1">{errors.address.line1.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address Line 2
            </label>
            <input
              {...register('address.line2')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Apartment, suite, etc."
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              {...register('address.state')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="State"
            />
            {errors.address?.state && (
              <p className="text-red-500 text-sm mt-1">{errors.address.state.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              {...register('address.city')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="City"
            />
            {errors.address?.city && (
              <p className="text-red-500 text-sm mt-1">{errors.address.city.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pincode *
            </label>
            <input
              {...register('address.pincode')}
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="123456"
            />
            {errors.address?.pincode && (
              <p className="text-red-500 text-sm mt-1">{errors.address.pincode.message}</p>
            )}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </button>

      <p className="text-sm text-gray-600 text-center">
        Already have an account?{' '}
        <button
          type="button"
          onClick={() => router.push('/auth/sign-in')}
          className="text-blue-600 hover:underline"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
