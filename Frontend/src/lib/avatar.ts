import { createSupabaseBrowserClient } from '@/lib/supabase-browser';

/**
 * Upload user avatar to Supabase storage
 * @param file - The image file to upload
 * @returns The path of the uploaded avatar
 */
export async function uploadAvatar(file: File) {
  const supabase = createSupabaseBrowserClient();
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not signed in');

    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size must be less than 5MB');
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload file to Supabase storage
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Update user profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        avatar_url: filePath,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      throw new Error(`Profile update failed: ${updateError.message}`);
    }

    return filePath;
  } catch (error) {
    console.error('Avatar upload error:', error);
    throw error;
  }
}

/**
 * Get signed URL for avatar display
 * @param path - The avatar path in storage
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns Signed URL for the avatar
 */
export async function getAvatarUrl(path: string, expiresIn: number = 3600) {
  const supabase = createSupabaseBrowserClient();
  
  try {
    if (!path) return null;

    const { data, error } = await supabase.storage
      .from('avatars')
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error('Error getting avatar URL:', error);
      return null;
    }

    return data?.signedUrl ?? null;
  } catch (error) {
    console.error('Error getting avatar URL:', error);
    return null;
  }
}

/**
 * Delete user avatar from storage
 * @param path - The avatar path to delete
 * @returns Success status
 */
export async function deleteAvatar(path: string) {
  const supabase = createSupabaseBrowserClient();
  
  try {
    if (!path) return false;

    // Delete file from storage
    const { error: deleteError } = await supabase.storage
      .from('avatars')
      .remove([path]);

    if (deleteError) {
      throw new Error(`Delete failed: ${deleteError.message}`);
    }

    // Update profile to remove avatar reference
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          avatar_url: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (updateError) {
        console.error('Profile update failed:', updateError);
      }
    }

    return true;
  } catch (error) {
    console.error('Avatar delete error:', error);
    return false;
  }
}

/**
 * Get default avatar URL for users without custom avatars
 * @param name - User's name for initials
 * @param size - Avatar size in pixels (default: 100)
 * @returns Default avatar URL
 */
export function getDefaultAvatarUrl(name: string, size: number = 100): string {
  const initials = name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const colors = [
    'FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7',
    'DDA0DD', '98D8C8', 'F7DC6F', 'BB8FCE', '85C1E9'
  ];
  
  const color = colors[Math.abs(name.length) % colors.length];
  
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=${color}&color=fff&size=${size}&font-size=0.4&bold=true`;
}

/**
 * Validate avatar file before upload
 * @param file - The file to validate
 * @returns Validation result
 */
export function validateAvatarFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  // Check file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { valid: false, error: 'File size must be less than 5MB' };
  }

  // Check file dimensions (optional - can be done on client)
  return { valid: true };
}
