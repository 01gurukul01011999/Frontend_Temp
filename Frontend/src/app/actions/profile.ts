'use server';

import { createSupabaseServerClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

/**
 * Server Action: Get current user profile
 * Retrieves the authenticated user's profile data
 */
export async function getProfileAction() {
  const supabase = await createSupabaseServerClient();

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { ok: false, message: 'Not authenticated' };
    }

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return { ok: false, message: profileError.message };
    }

    return { ok: true, profile };
  } catch (error) {
    console.error('Get profile error:', error);
    return { ok: false, message: 'Failed to get profile' };
  }
}

/**
 * Server Action: Update user profile
 * Updates the authenticated user's profile information
 */
export async function updateProfileAction(form: FormData) {
  const supabase = await createSupabaseServerClient();

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { ok: false, message: 'Not authenticated' };
    }

    // Extract form data
    const firstName = String(form.get('firstName') || '').trim();
    const lastName = String(form.get('lastName') || '').trim();
    const phone = String(form.get('phone') || '').trim();
    const businessName = String(form.get('businessName') || '').trim();
    const gstNumber = String(form.get('gstNumber') || '').trim().toUpperCase();
    const address = String(form.get('address') || '').trim();
    const state = String(form.get('state') || '').trim();
    const city = String(form.get('city') || '').trim();
    const pincode = String(form.get('pincode') || '').trim();

    // Validate required fields
    if (!firstName || !lastName || !phone || !businessName || !address || !state || !city || !pincode) {
      return { ok: false, message: 'All required fields must be filled' };
    }

    // Update profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        first_name: firstName,
        last_name: lastName,
        phone,
        business_name: businessName,
        gst_number: gstNumber,
        address,
        state,
        city,
        pincode,
        account_status: 'completed',
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      return { ok: false, message: updateError.message };
    }

    // Revalidate profile-related pages
    revalidatePath('/dashboard/account');
    revalidatePath('/dashboard/profile');

    return { ok: true, message: 'Profile updated successfully!' };
  } catch (error) {
    console.error('Update profile error:', error);
    return { ok: false, message: 'Failed to update profile' };
  }
}

/**
 * Server Action: Update user avatar
 * Updates the user's avatar URL in their profile
 */
export async function updateAvatarAction(avatarUrl: string) {
  const supabase = createSupabaseServerClient();

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { ok: false, message: 'Not authenticated' };
    }

    // Update avatar URL in profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (updateError) {
      return { ok: false, message: updateError.message };
    }

    // Revalidate profile-related pages
    revalidatePath('/dashboard/account');
    revalidatePath('/dashboard/profile');

    return { ok: true, message: 'Avatar updated successfully!' };
  } catch (error) {
    console.error('Update avatar error:', error);
    return { ok: false, message: 'Failed to update avatar' };
  }
}

/**
 * Server Action: Delete user account
 * Deletes the user's profile and auth account
 */
export async function deleteAccountAction() {
  const supabase = createSupabaseServerClient();

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { ok: false, message: 'Not authenticated' };
    }

    // Delete profile first
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id);

    if (profileError) {
      console.error('Profile deletion error:', profileError);
    }

    // Delete auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

    if (authError) {
      return { ok: false, message: authError.message };
    }

    return { ok: true, message: 'Account deleted successfully!' };
  } catch (error) {
    console.error('Delete account error:', error);
    return { ok: false, message: 'Failed to delete account' };
  }
}

/**
 * Server Action: Get user by ID (admin only)
 * Retrieves a user's profile by ID for administrative purposes
 */
export async function getUserByIdAction(userId: string) {
  const supabase = createSupabaseServerClient();

  try {
    // Get current user to check permissions
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return { ok: false, message: 'Not authenticated' };
    }

    // Get current user's profile to check role
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || currentProfile?.role !== 'admin') {
      return { ok: false, message: 'Insufficient permissions' };
    }

    // Get target user's profile
    const { data: targetProfile, error: targetError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (targetError) {
      return { ok: false, message: targetError.message };
    }

    return { ok: true, profile: targetProfile };
  } catch (error) {
    console.error('Get user by ID error:', error);
    return { ok: false, message: 'Failed to get user' };
  }
}
