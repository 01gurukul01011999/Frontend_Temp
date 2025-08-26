import { createBrowserClient } from '@supabase/ssr';
import { env } from '../env';

/**
 * Supabase browser client for client-side operations
 * Uses anon key and persists sessions automatically
 */
export const createSupabaseClient = () => {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  );
};

// Export singleton instance
export const supabase = createSupabaseClient();
