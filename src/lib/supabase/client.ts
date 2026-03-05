/**
 * Supabase client singleton and env validation.
 * Single source of truth for database access.
 */

import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ?? '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';

export function validateSupabaseEnv(): { valid: boolean; missingVars: string[] } {
  const missingVars: string[] = [];
  if (!supabaseUrl) missingVars.push('VITE_SUPABASE_URL');
  if (!supabaseAnonKey) missingVars.push('VITE_SUPABASE_ANON_KEY');
  return { valid: missingVars.length === 0, missingVars };
}

const { valid } = validateSupabaseEnv();
if (!valid) {
  console.error('[Supabase] Missing environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseAnonKey);
