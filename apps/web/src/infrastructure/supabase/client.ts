import { createClient } from '@supabase/supabase-js';

/**
 * Creates a client-side Supabase client with anon key
 * This client is safe to use in the browser
 */
export function createSupabaseClient() {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required');
  }

  return createClient(supabaseUrl, supabaseAnonKey);
}

