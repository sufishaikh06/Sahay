import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './index';

let supabaseClient: SupabaseClient | null = null;

/**
 * Supabase client initialization for supporting storage & realtime features.
 * Never exposes service role key to frontend.
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (supabaseClient) return supabaseClient;

  if (!config.supabaseUrl || !config.supabaseServiceRoleKey) {
    console.warn('[SUPABASE WARNING] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing.');
    return null;
  }

  try {
    supabaseClient = createClient(config.supabaseUrl, config.supabaseServiceRoleKey, {
      auth: { persistSession: false },
    });
    console.log('[SUPABASE] Client initialized successfully');
    return supabaseClient;
  } catch (err: any) {
    console.error(`[SUPABASE ERROR] Initialization failed: ${err.message}`);
    return null;
  }
}
