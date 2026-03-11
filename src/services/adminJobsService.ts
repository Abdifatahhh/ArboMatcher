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

export type ReviewStatusFilter = '' | 'draft' | 'submitted' | 'under_review' | 'changes_requested' | 'approved' | 'published' | 'rejected';

export interface ListJobsReviewParams {
  review_status?: ReviewStatusFilter;
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: 'newest' | 'oldest' | 'score_high' | 'score_low';
}

export async function listJobsForReview(params: ListJobsReviewParams): Promise<ListJobsResult> {
  const { review_status, search, page = 1, pageSize = PAGE_SIZE_DEFAULT, sort = 'newest' } = params;

  let query = supabase
    .from('jobs')
    .select('*, employers(*)', { count: 'exact' });

  if (review_status && review_status !== '') {
    query = query.eq('review_status', review_status);
  }

  if (search && search.trim() !== '') {
    const term = `%${search.trim()}%`;
    query = query.or(`title.ilike.${term},company_name.ilike.${term}`);
  }

  const orderBy = sort === 'oldest' ? 'created_at' : sort === 'score_high' ? 'overall_score' : sort === 'score_low' ? 'overall_score' : 'created_at';
  const ascending = sort === 'oldest' || sort === 'score_low';
  query = query.order(orderBy, { ascending, nullsFirst: false });

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data: rows, count, error } = await query;

  if (error) throw error;

  const list = (rows as (Job & { employers: Employer | null })[]) ?? [];
  const data: AdminJobRow[] = list.map((r) => ({ job: r as Job, employer: r.employers ?? null }));

  return { data, total: count ?? 0 };
}

export async function getJobReviewStats(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from('jobs').select('review_status, overall_score');
  if (error) return { total: 0 };

  const counts: Record<string, number> = { total: data?.length ?? 0 };
  (data ?? []).forEach((r: { review_status?: string }) => {
    const s = r.review_status ?? 'draft';
    counts[s] = (counts[s] ?? 0) + 1;
  });
  const withScore = (data ?? []).filter((r: { overall_score?: number | null }) => r.overall_score != null);
  if (withScore.length > 0) {
    const sum = (withScore as { overall_score: number }[]).reduce((a, r) => a + r.overall_score, 0);
    counts.average_score = Math.round(sum / withScore.length);
  }
  return counts;
}
