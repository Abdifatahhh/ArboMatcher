/**
 * Admin Gebruikers (profiles) service.
 * List profiles with filters (role, status), search, pagination.
 */

import { supabase } from '../lib/supabase';
import type { Profile, UserRole } from '../lib/types';

export type RoleFilter = '' | UserRole;
export type StatusFilter = '' | 'ACTIVE' | 'BLOCKED';

export interface ListUsersParams {
  role?: RoleFilter;
  status?: StatusFilter;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ListUsersResult {
  data: Profile[];
  total: number;
}

const PAGE_SIZE_DEFAULT = 20;

export async function listUsers(params: ListUsersParams): Promise<ListUsersResult> {
  const { role, status, search, page = 1, pageSize = PAGE_SIZE_DEFAULT } = params;

  let query = supabase
    .from('profiles')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (role && role !== '') {
    query = query.eq('role', role);
  }
  if (status && status !== '') {
    query = query.eq('status', status);
  }
  if (search && search.trim() !== '') {
    const term = `%${search.trim()}%`;
    query = query.or(`email.ilike.${term},full_name.ilike.${term}`);
  }

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, count, error } = await query;

  if (error) throw error;

  return { data: (data as Profile[]) ?? [], total: count ?? 0 };
}

export async function toggleUserBlocked(profileId: string): Promise<{ error: Error | null }> {
  const { data: profile } = await supabase.from('profiles').select('status').eq('id', profileId).maybeSingle();
  if (!profile) return { error: new Error('Gebruiker niet gevonden') };
  const newStatus = profile.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
  const { error } = await supabase.from('profiles').update({ status: newStatus }).eq('id', profileId);
  return { error: error ?? null };
}
