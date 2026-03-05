/**
 * Admin Opdrachten (jobs) service.
 * List jobs with employer, filters (status), search, pagination.
 */

import { supabase } from '../lib/supabase';
import type { Job, Employer } from '../lib/types';

export type JobStatusFilter = '' | 'DRAFT' | 'PUBLISHED' | 'CLOSED';

export interface AdminJobRow {
  job: Job;
  employer: Employer | null;
}

export interface ListJobsParams {
  status?: JobStatusFilter;
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface ListJobsResult {
  data: AdminJobRow[];
  total: number;
}

const PAGE_SIZE_DEFAULT = 20;

export async function listJobs(params: ListJobsParams): Promise<ListJobsResult> {
  const { status, search, page = 1, pageSize = PAGE_SIZE_DEFAULT } = params;

  let query = supabase
    .from('jobs')
    .select('*, employers(*)', { count: 'exact' })
    .order('created_at', { ascending: false });

  if (status && status !== '') {
    query = query.eq('status', status);
  }

  if (search && search.trim() !== '') {
    const term = `%${search.trim()}%`;
    query = query.or(`title.ilike.${term},company_name.ilike.${term}`);
  }

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data: rows, count, error } = await query;

  if (error) throw error;

  const list = (rows as (Job & { employers: Employer | null })[]) ?? [];
  const data: AdminJobRow[] = list.map((r) => ({ job: r as Job, employer: r.employers ?? null }));

  return { data, total: count ?? 0 };
}

export async function updateJobStatus(
  id: string,
  status: 'DRAFT' | 'PUBLISHED' | 'CLOSED'
): Promise<{ error: Error | null }> {
  const { error } = await supabase.from('jobs').update({ status }).eq('id', id);
  return { error: error ?? null };
}
