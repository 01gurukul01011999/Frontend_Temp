'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';

/**
 * Server Action: User Registration
 * Handles user sign up with profile creation
 */
export async function signUpAction(form: FormData) {
  const supabase = await createSupabaseServerClient();

  try {
    // Extract form data
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');
    const firstName = String(form.get('firstName') || '');
    const lastName = String(form.get('lastName') || '');
    const rawPhone = String(form.get('phone') || '');
    const phone = rawPhone.startsWith('+91') ? rawPhone : `+91${rawPhone.replace(/\D/g, '')}`;
    const businessName = String(form.get('businessName') || '');
    const gstNumber = String(form.get('gstNumber') || '').toUpperCase();
    const pincode = String(form.get('pincode') || '');
    const state = String(form.get('state') || '');
    const city = String(form.get('city') || '');
    const addressLine1 = String(form.get('addressLine1') || '');
    const addressLine2 = String(form.get('addressLine2') || '');

    // Combine address lines
    const address = addressLine2 
      ? `${addressLine1}, ${addressLine2}`
      : addressLine1;

    // Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/auth/callback`,
        data: { 
          first_name: firstName, 
          last_name: lastName, 
          phone, 
          business_name: businessName, 
          gst_number: gstNumber, 
          address,
          state,
          city,
          pincode
        },
      },
    });

    if (authError) {
      return { ok: false, message: authError.message };
    }

    if (authData.user) {
      // Create profile in profiles table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          phone,
          business_name: businessName,
          gst_number: gstNumber,
          address,
          state,
          city,
          pincode,
          account_status: 'pending',
          role: 'seller',
        });

      if (profileError) {
        console.error('Profile creation failed:', profileError);
        // Don't return error as user is still created
      }
    }

    return { ok: true, message: 'Account created successfully! Please check your email to verify your account.' };
  } catch (error) {
    console.error('Sign up error:', error);
    return { ok: false, message: 'An unexpected error occurred. Please try again.' };
  }
}

/**
 * Server Action: User Sign In
 * Handles user authentication
 */
export async function signInAction(form: FormData) {
  const supabase = await createSupabaseServerClient();

  try {
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '');

    const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });

    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: 'Signed in successfully!' };
  } catch (error) {
    console.error('Sign in error:', error);
    return { ok: false, message: 'An unexpected error occurred. Please try again.' };
  }
}

/**
 * Server Action: User Sign Out
 * Handles user logout
 */
export async function signOutAction() {
  const supabase = await createSupabaseServerClient();

  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: 'Signed out successfully!' };
  } catch (error) {
    console.error('Sign out error:', error);
    return { ok: false, message: 'An unexpected error occurred. Please try again.' };
  }
}

/**
 * Server Action: Password Reset Request
 * Sends password reset email
 */
export async function resetPasswordAction(form: FormData) {
  const supabase = await createSupabaseServerClient();

  try {
    const email = String(form.get('email') || '').trim();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000'}/auth/reset-password`,
    });

    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: 'Password reset email sent! Please check your inbox.' };
  } catch (error) {
    console.error('Password reset error:', error);
    return { ok: false, message: 'An unexpected error occurred. Please try again.' };
  }
}

/**
 * Server Action: Update Password
 * Updates user password after reset
 */
export async function updatePasswordAction(form: FormData) {
  const supabase = await createSupabaseServerClient();

  try {
    const password = String(form.get('password') || '');

    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return { ok: false, message: error.message };
    }

    return { ok: true, message: 'Password updated successfully!' };
  } catch (error) {
    console.error('Password update error:', error);
    return { ok: false, message: 'An unexpected error occurred. Please try again.' };
  }
}
