/**
 * Admin Opdrachtgevers (clients) service.
 * Uses real table names: profiles, employers, jobs (see adminClientsSchema).
 */

import { supabase } from '../lib/supabase';
import type { Employer, Profile } from '../lib/types';
import { EMPLOYERS_TABLE, JOBS_TABLE, JOBS_EMPLOYER_FK, PROFILES_TABLE, PROFILES_STATUS_COLUMN, EMPLOYERS_CLIENT_TYPE_COLUMN } from '../lib/schemas/adminClientsSchema';

export interface AdminClientRow {
  employer: Employer;
  profile: Profile;
  jobs_count: number;
}

export interface ListClientsParams {
  type?: 'direct' | 'intermediair' | 'detacheerder' | '';
  status?: 'ACTIVE' | 'BLOCKED' | '';
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ListClientsResult {
  data: AdminClientRow[];
  total: number;
}

const PAGE_SIZE_DEFAULT = 20;

/**
 * List opdrachtgevers: employers with profile (role OPDRACHTGEVER).
 * Server-side filters: type (employers.client_type), status (profiles.status), search (company_name, email).
 * Job counts in one extra query (no N+1).
 */
export async function listClients(params: ListClientsParams): Promise<ListClientsResult> {
  const { type, status, search, page = 1, pageSize = PAGE_SIZE_DEFAULT } = params;

  let query = supabase
    .from(EMPLOYERS_TABLE)
    .select('*, profiles!inner(*)', { count: 'exact' })
    .eq('profiles.role', 'OPDRACHTGEVER');

  if (type && type !== '') {
    query = query.eq(EMPLOYERS_CLIENT_TYPE_COLUMN, type);
  }
  if (status && status !== '') {
    query = query.eq('profiles.status', status);
  }
  if (search && search.trim() !== '') {
    const term = search.trim();
    const { data: profileRows } = await supabase
      .from(PROFILES_TABLE)
      .select('id')
      .eq('role', 'OPDRACHTGEVER')
      .or(`email.ilike.%${term}%,full_name.ilike.%${term}%`);
    const profileIds = (profileRows ?? []).map((r) => r.id);
    const { data: employerByCompany } = await supabase
      .from(EMPLOYERS_TABLE)
      .select('id')
      .ilike('company_name', `%${term}%`);
    const companyIds = (employerByCompany ?? []).map((r) => r.id);
    const { data: employerByProfile } = profileIds.length
      ? await supabase.from(EMPLOYERS_TABLE).select('id').in('user_id', profileIds)
      : { data: [] };
    const profileEmployerIds = (employerByProfile ?? []).map((r) => r.id);
    const allIds = [...new Set([...companyIds, ...profileEmployerIds])];
    if (allIds.length === 0) return { data: [], total: 0 };
    query = query.in('id', allIds);
  }

  query = query.order('created_at', { ascending: false });
  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data: rows, count, error } = await query;

  if (error) {
    throw error;
  }

  const list = (rows as (Employer & { profiles: Profile | null })[]) || [];
  const total = count ?? 0;

  // Filter out any row where profile is missing (safety)
  const withProfile = list.filter((r) => r.profiles != null) as (Employer & { profiles: Profile })[];
  const employerIds = withProfile.map((r) => r.id);

  // Single query for all job counts for this page (no N+1)
  let jobCounts: Record<string, number> = {};
  if (employerIds.length > 0) {
    const { data: jobRows } = await supabase
      .from(JOBS_TABLE)
      .select(JOBS_EMPLOYER_FK)
      .in(JOBS_EMPLOYER_FK, employerIds);
    const jobs = (jobRows || []) as { employer_id: string }[];
    jobs.forEach((j) => {
      jobCounts[j.employer_id] = (jobCounts[j.employer_id] ?? 0) + 1;
    });
  }

  const data: AdminClientRow[] = withProfile.map((r) => ({
    employer: r as unknown as Employer,
    profile: r.profiles,
    jobs_count: jobCounts[r.id] ?? 0,
  }));

  return { data, total };
}

/**
 * Get one opdrachtgever by employer id (for detail page).
 */
export async function getClientById(id: string): Promise<AdminClientRow | null> {
  const { data: employer, error: eError } = await supabase
    .from(EMPLOYERS_TABLE)
    .select('*, profiles(*)')
    .eq('id', id)
    .maybeSingle();

  if (eError || !employer) return null;
  const row = employer as Employer & { profiles: Profile | null };
  if (!row.profiles || row.profiles.role !== 'OPDRACHTGEVER') return null;

  const { count } = await supabase
    .from(JOBS_TABLE)
    .select('id', { count: 'exact', head: true })
    .eq(JOBS_EMPLOYER_FK, id);

  return {
    employer: row as unknown as Employer,
    profile: row.profiles,
    jobs_count: count ?? 0,
  };
}

/**
 * Get opdrachtgever by profile id (user_id); for linking from Gebruikers.
 */
export async function getClientByProfileId(profileId: string): Promise<AdminClientRow | null> {
  const { data: employer } = await supabase
    .from(EMPLOYERS_TABLE)
    .select(`*, profiles!${EMPLOYERS_TABLE}_user_id_fkey(*)`)
    .eq('user_id', profileId)
    .maybeSingle();
  if (!employer) return null;
  return getClientById((employer as Employer).id);
}

/**
 * Update employer and/or profile (bedrijfsnaam, contactpersoon, telefoon, type).
 */
export async function updateClient(
  employerId: string,
  payload: {
    company_name?: string;
    full_name?: string | null;
    phone?: string | null;
    client_type?: 'direct' | 'intermediair' | 'detacheerder';
  }
): Promise<{ error: Error | null }> {
  const { profile, employer } = (await getClientById(employerId)) ?? {};
  if (!profile || !employer) return { error: new Error('Opdrachtgever niet gevonden') };

  if (payload.company_name !== undefined) {
    const { error } = await supabase.from(EMPLOYERS_TABLE).update({ company_name: payload.company_name }).eq('id', employerId);
    if (error) return { error };
  }
  if (payload.client_type !== undefined) {
    const { error } = await supabase.from(EMPLOYERS_TABLE).update({ client_type: payload.client_type }).eq('id', employerId);
    if (error) return { error };
  }
  if (payload.full_name !== undefined || payload.phone !== undefined) {
    const updates: Partial<Profile> = {};
    if (payload.full_name !== undefined) updates.full_name = payload.full_name;
    if (payload.phone !== undefined) updates.phone = payload.phone;
    const { error } = await supabase.from(PROFILES_TABLE).update(updates).eq('id', profile.id);
    if (error) return { error };
  }
  return { error: null };
}

/**
 * Toggle blocked: set profiles.status to BLOCKED or ACTIVE.
 */
export async function toggleClientBlocked(employerId: string): Promise<{ error: Error | null }> {
  const row = await getClientById(employerId);
  if (!row) return { error: new Error('Opdrachtgever niet gevonden') };
  const newStatus = row.profile.status === 'BLOCKED' ? 'ACTIVE' : 'BLOCKED';
  const { error } = await supabase.from(PROFILES_TABLE).update({ status: newStatus }).eq('id', row.profile.id);
  return { error: error ?? null };
}

export interface ListClientJobsParams {
  page?: number;
  pageSize?: number;
}

import type { Job } from '../lib/types';

export interface JobWithMeta extends Job {
  id: string;
  title: string;
  status: string;
  created_at: string;
}

/**
 * List jobs for one opdrachtgever (employer_id). For detail page.
 */
export async function listClientJobs(
  employerId: string,
  params: ListClientJobsParams = {}
): Promise<{ data: JobWithMeta[]; total: number }> {
  const { page = 1, pageSize = 10 } = params;
  const from = (page - 1) * pageSize;

  const { data: jobs, count, error } = await supabase
    .from(JOBS_TABLE)
    .select('id, title, status, created_at', { count: 'exact' })
    .eq(JOBS_EMPLOYER_FK, employerId)
    .order('created_at', { ascending: false })
    .range(from, from + pageSize - 1);

  if (error) throw error;
  const list = (jobs || []) as JobWithMeta[];
  return { data: list, total: count ?? 0 };
}
