import { createBrowserClient } from '@supabase/ssr';
import { env } from '../env';

export const createSupabaseClient = () => {
  return createBrowserClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
      global: {
        headers: {
          'X-Client-Info': 'seller-panel-frontend',
        },
        fetch: (url, options = {}) => {
          // Add timeout to fetch requests
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds
          
          return fetch(url, {
            ...options,
            signal: controller.signal,
          }).finally(() => clearTimeout(timeoutId));
        },
      },
      realtime: {
        timeout: 15000,
        heartbeatIntervalMs: 30000,
      },
    }
  );
};

// Export singleton instance
export const supabase = createSupabaseClient();
