import supabaseAdmin from './supabase-admin';

/**
 * Admin-only functions for managing user accounts
 * These functions bypass RLS and should only be called from server-side code
 */

export interface AdminUserUpdate {
  role?: 'seller' | 'admin' | 'customer';
  account_status?: 'pending' | 'completed' | 'suspended';
  is_verified?: boolean;
}

/**
 * Update user account status (admin only)
 */
export async function updateUserAccountStatus(
  userId: string,
  updates: AdminUserUpdate
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('profiles')
      .update(updates)
      .eq('id', userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Admin update error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Approve a seller account (set status to completed)
 */
export async function approveSellerAccount(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  return updateUserAccountStatus(userId, {
    account_status: 'completed',
    is_verified: true,
  });
}

/**
 * Suspend a user account
 */
export async function suspendUserAccount(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  return updateUserAccountStatus(userId, {
    account_status: 'suspended',
  });
}

/**
 * Promote user to admin
 */
export async function promoteToAdmin(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  return updateUserAccountStatus(userId, {
    role: 'admin',
    account_status: 'completed',
    is_verified: true,
  });
}

/**
 * Get all users with their profiles (admin only)
 */
export async function getAllUsers(): Promise<{
  success: boolean;
  users?: any[];
  error?: string;
}> {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        id,
        email,
        first_name,
        last_name,
        business_name,
        role,
        account_status,
        is_verified,
        created_at,
        updated_at
      `)
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, users };
  } catch (error) {
    console.error('Get all users error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Get user profile by ID (admin only)
 */
export async function getUserProfile(
  userId: string
): Promise<{
  success: boolean;
  profile?: any;
  error?: string;
}> {
  try {
    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select(`
        *,
        addresses (*)
      `)
      .eq('id', userId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, profile };
  } catch (error) {
    console.error('Get user profile error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Delete user account and all associated data (admin only)
 */
export async function deleteUserAccount(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Delete from auth.users (this will cascade to profiles and addresses)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Delete user error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}
