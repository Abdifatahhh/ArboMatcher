/**
 * Run orphan check via Supabase RPC. Requires migration 20260306150100_admin_check_orphans.sql.
 * Set VITE_SUPABASE_URL (or SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY in .env or environment.
 */
import { createClient } from '@supabase/supabase-js';

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Stel VITE_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY in (bijv. in .env).');
  process.exit(1);
}

const supabase = createClient(url, key);
const { data, error } = await supabase.rpc('admin_check_orphans');

if (error) {
  console.error('Fout:', error.message);
  process.exit(1);
}

console.log('Orphan check resultaat:');
console.log(JSON.stringify(data, null, 2));
const conv = data?.conversations_met_ontbrekende_participant ?? 0;
const prof = data?.profiles_zonder_auth_user ?? 0;
if (conv === 0 && prof === 0) {
  console.log('Geen orphans gevonden.');
} else {
  console.log(`Let op: ${conv} conversations met ontbrekende participant, ${prof} profiles zonder auth user.`);
}
