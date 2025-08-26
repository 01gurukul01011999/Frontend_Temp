import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * Supabase Admin Client for Backend Operations
 * 
 * This client uses the service role key and should ONLY be used on the server side.
 * It has full access to the database and can bypass RLS policies.
 * 
 * WARNING: Never expose this client to the frontend or use the service role key
 * in client-side code.
 */
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

/**
 * Admin utility functions for user management
 */
export const adminUtils = {
  /**
   * Get user profile by email (admin access)
   */
  async getUserProfileByEmail(email) {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('email', email)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { profile: data };
    } catch (error) {
      return { error: error.message };
    }
  },

  /**
   * Update user profile (admin access)
   */
  async updateUserProfile(userId, updates) {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { profile: data };
    } catch (error) {
      return { error: error.message };
    }
  },

  /**
   * Delete user profile (admin access)
   */
  async deleteUserProfile(userId) {
    try {
      const { error } = await supabaseAdmin
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    } catch (error) {
      return { error: error.message };
    }
  },

  /**
   * List all users (admin access)
   */
  async listAllUsers() {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return { users: data };
    } catch (error) {
      return { error: error.message };
    }
  },

  /**
   * Get user by ID (admin access)
   */
  async getUserById(userId) {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return { user: data };
    } catch (error) {
      return { error: error.message };
    }
  }
};

export default supabaseAdmin;
