import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates a Supabase client for client-side operations
 * This client handles browser-based authentication and data operations
 */
export const createSupabaseBrowserClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
