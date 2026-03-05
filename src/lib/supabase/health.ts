/**
 * Database health check for auth and monitoring.
 */

import { supabase, validateSupabaseEnv } from './client';

export type HealthCheckResult = {
  healthy: boolean;
  category: 'ok' | 'env_missing' | 'network_error' | 'schema_error' | 'rls_error' | 'unknown';
  error?: string;
  timestamp: string;
  hostname: string;
};

export async function checkDatabaseHealth(): Promise<HealthCheckResult> {
  const result: HealthCheckResult = {
    healthy: false,
    category: 'unknown',
    timestamp: new Date().toISOString(),
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  };

  const envCheck = validateSupabaseEnv();
  if (!envCheck.valid) {
    result.category = 'env_missing';
    result.error = `Missing environment variables: ${envCheck.missingVars.join(', ')}`;
    console.error('[Health Check]', result);
    return result;
  }

  try {
    const { error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);

    if (profilesError) {
      const errorMsg = profilesError.message.toLowerCase();
      if (errorMsg.includes('relation') || errorMsg.includes('does not exist') || errorMsg.includes('schema')) {
        result.category = 'schema_error';
        result.error = `Schema issue: ${profilesError.message}`;
      } else if (errorMsg.includes('permission') || errorMsg.includes('policy') || errorMsg.includes('rls')) {
        result.category = 'rls_error';
        result.error = `RLS/Permission issue: ${profilesError.message}`;
      } else {
        result.category = 'unknown';
        result.error = profilesError.message;
      }
      console.error('[Health Check]', result);
      return result;
    }

    result.healthy = true;
    result.category = 'ok';
    return result;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
      result.category = 'network_error';
    } else {
      result.category = 'unknown';
    }
    result.error = errorMessage;
    console.error('[Health Check]', result);
    return result;
  }
}
