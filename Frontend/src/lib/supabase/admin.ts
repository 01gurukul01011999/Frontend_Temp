import { createClient } from '@supabase/supabase-js';

/**
 * Supabase admin client for server-side operations
 * Uses service role key and bypasses RLS
 * NEVER expose this to the browser
 */
export const createSupabaseAdmin = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables'
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Export singleton instance
export const supabaseAdmin = createSupabaseAdmin();
