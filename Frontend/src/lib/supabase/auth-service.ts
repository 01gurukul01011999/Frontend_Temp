import { createSupabaseBrowserClient } from '../supabase-browser';
import type { Profile, ProfileInsert, ProfileUpdate } from '../supabase/types';

export interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  businessName?: string;
  gstNumber?: string;
  address?: string;
  state?: string;
  city?: string;
  pincode?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

export interface UpdateProfileParams {
  firstName?: string;
  lastName?: string;
  phone?: string;
  businessName?: string;
  gstNumber?: string;
  address?: string;
  state?: string;
  city?: string;
  pincode?: string;
}

/**
 * Supabase Authentication Service
 * Handles all authentication and profile operations
 */
export class SupabaseAuthService {
  /**
   * Sign up a new user with email/password
   */
  async signUp(params: SignUpParams): Promise<{ error?: string; user?: any }> {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
      });

      if (authError) {
        return { error: authError.message };
      }

      if (authData.user) {
        // Create profile in profiles table
        const profileData: ProfileInsert = {
          id: authData.user.id,
          email: params.email,
          first_name: params.firstName,
          last_name: params.lastName,
          phone: params.phone || null,
          business_name: params.businessName || null,
          gst_number: params.gstNumber || null,
          address: params.address || null,
          state: params.state || null,
          city: params.city || null,
          pincode: params.pincode || null,
          account_status: 'pending',
          role: 'seller',
        };

        const { error: profileError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (profileError) {
          // If profile creation fails, we should handle this gracefully
          console.error('Profile creation failed:', profileError);
          // Don't return error as user is still created
        }
      }

      return { user: authData.user };
    } catch (error) {
      return { error: 'An unexpected error occurred during sign up' };
    }
  }

  /**
   * Sign in user with email/password
   */
  async signIn(params: SignInParams): Promise<{ error?: string; user?: any }> {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase.auth.signInWithPassword({
        email: params.email,
        password: params.password,
      });

      if (error) {
        return { error: error.message };
      }

      return { user: data.user };
    } catch (error) {
      return { error: 'An unexpected error occurred during sign in' };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error?: string }> {
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.signOut();
      if (error) {
        return { error: error.message };
      }
      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred during sign out' };
    }
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<{ user?: any; error?: string }> {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        return { error: error.message };
      }

      return { user };
    } catch (error) {
      return { error: 'An unexpected error occurred while getting user' };
    }
  }

  /**
   * Get user profile from profiles table
   */
  async getUserProfile(userId: string): Promise<{ profile?: Profile; error?: string }> {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        return { error: error.message };
      }

      return { profile: data };
    } catch (error) {
      return { error: 'An unexpected error occurred while getting profile' };
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: UpdateProfileParams): Promise<{ error?: string }> {
    try {
      const profileUpdates: ProfileUpdate = {
        first_name: updates.firstName,
        last_name: updates.lastName,
        phone: updates.phone,
        business_name: updates.businessName,
        gst_number: updates.gstNumber,
        address: updates.address,
        state: updates.state,
        city: updates.city,
        pincode: updates.pincode,
        account_status: 'completed',
        updated_at: new Date().toISOString(),
      };

      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', userId);

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred while updating profile' };
    }
  }

  /**
   * Request password reset
   */
  async resetPassword(email: string): Promise<{ error?: string }> {
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred while requesting password reset' };
    }
  }

  /**
   * Update password
   */
  async updatePassword(newPassword: string): Promise<{ error?: string }> {
    try {
      const supabase = createSupabaseBrowserClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { error: error.message };
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred while updating password' };
    }
  }

  /**
   * Get current session
   */
  async getSession(): Promise<{ session?: any; error?: string }> {
    try {
      const supabase = createSupabaseBrowserClient();
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        return { error: error.message };
      }

      return { session };
    } catch (error) {
      return { error: 'An unexpected error occurred while getting session' };
    }
  }

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: any) => void) {
    const supabase = createSupabaseBrowserClient();
    return supabase.auth.onAuthStateChange(callback);
  }
}

// Export singleton instance
export const authService = new SupabaseAuthService();
