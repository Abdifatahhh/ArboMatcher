/**
 * Admin Reacties (applications/sollicitaties) service.
 * List applications with job and doctor+profile, filters, search, pagination.
 */

import { supabase } from '../lib/supabase';
import type { Application, Job, Doctor, Profile } from '../lib/types';

export type ApplicationStatusFilter = '' | 'PENDING' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED';

export interface AdminApplicationRow {
  application: Application;
  job: Job | null;
  doctor: (Doctor & { profiles: Profile | null }) | null;
  profile: Profile | null;
}

export interface ListApplicationsParams {
  status?: ApplicationStatusFilter;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ListApplicationsResult {
  data: AdminApplicationRow[];
  total: number;
}

const PAGE_SIZE_DEFAULT = 20;

export async function listApplications(params: ListApplicationsParams): Promise<ListApplicationsResult> {
  const { status, search, page = 1, pageSize = PAGE_SIZE_DEFAULT } = params;

  let query = supabase
    .from('applications')
    .select('*, jobs(*), professionals(*, profiles(*))', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (status && status !== '') {
    query = query.eq('status', status);
  }

  if (search && search.trim() !== '') {
    const term = `%${search.trim()}%`;
    const [jobsRes, doctorsRes] = await Promise.all([
      supabase.from('jobs').select('id').ilike('title', term),
      supabase.from('profiles').select('id').or(`full_name.ilike.${term},email.ilike.${term}`),
    ]);
    const jobIds = (jobsRes.data ?? []).map((r) => r.id);
    const profileIds = (doctorsRes.data ?? []).map((r) => r.id);
    const { data: doctorsByProfile } = profileIds.length
      ? await supabase.from('professionals').select('id').in('user_id', profileIds)
      : { data: [] };
    const doctorIds = (doctorsByProfile ?? []).map((r) => r.id);
    const allAppIds: string[] = [];
    if (jobIds.length > 0) {
      const { data: appByJob } = await supabase.from('applications').select('id').in('job_id', jobIds);
      (appByJob ?? []).forEach((r) => allAppIds.push(r.id));
    }
    if (doctorIds.length > 0) {
      const { data: appByDoctor } = await supabase.from('applications').select('id').in('doctor_id', doctorIds);
      (appByDoctor ?? []).forEach((r) => allAppIds.push(r.id));
    }
    const unique = [...new Set(allAppIds)];
    if (unique.length === 0) return { data: [], total: 0 };
    query = query.in('id', unique);
  }

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data: rows, count, error } = await query;

  if (error) throw error;

  const list = (rows as (Application & { jobs: Job | null; professionals: (Doctor & { profiles: Profile | null }) | null })[]) ?? [];
  const data: AdminApplicationRow[] = list.map((r) => ({
    application: r as Application,
    job: r.jobs ?? null,
    doctor: r.professionals ?? null,
    profile: r.professionals?.profiles ?? null,
  }));

  return { data, total: count ?? 0 };
}

export async function updateApplicationStatus(
  id: string,
  status: Application['status']
): Promise<{ error: Error | null }> {
  const { error } = await supabase.from('applications').update({ status }).eq('id', id);
  return { error: error ?? null };
}
