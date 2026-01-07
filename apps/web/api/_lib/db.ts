import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client with service role key (server-side only)
 * This client has full access to the database and should NEVER be exposed to the client
 */
export function createServerSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    // Log available env vars for debugging
    console.error('Available Supabase env vars:', Object.keys(process.env).filter(k => k.includes('SUPA')));
    throw new Error('Missing Supabase environment variables: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

