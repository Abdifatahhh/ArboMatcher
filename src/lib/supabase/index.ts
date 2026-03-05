/**
 * Supabase: client, env validation, and health check.
 */

export { supabase, validateSupabaseEnv } from './client';
export { checkDatabaseHealth, type HealthCheckResult } from './health';
