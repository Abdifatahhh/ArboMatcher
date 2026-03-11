/**
 * Job review workflow: submit, admin actions, history.
 */

import { supabase } from '../lib/supabase';
import type { JobReviewStatus } from '../lib/jobReviewTypes';
import { buildChecklist, getScores, computeOverallScore } from './jobScoringService';
import { runJobAIReview, toJobAIFeedback } from './jobAIReviewService';
import type { Job } from '../lib/types';

export interface SubmitJobForReviewResult {
  error: string | null;
  structure_score?: number;
  ai_score?: number;
  overall_score?: number;
}

export async function submitJobForReview(jobId: string): Promise<SubmitJobForReviewResult> {
  const { data: job, error: fetchError } = await supabase
    .from('jobs')
    .select('*, employers(*)')
    .eq('id', jobId)
    .single();

  if (fetchError || !job) return { error: fetchError?.message ?? 'Opdracht niet gevonden' };

  const j = job as Job & { employers?: { company_name?: string } | null };
  const { structureScore } = buildChecklist(j, j.employers ?? null);
  let aiScore: number | null = null;
  let aiPayload: Record<string, unknown> = {};

  try {
    const aiResult = await runJobAIReview(j);
    aiScore = aiResult.ai_score;
    const feedback = toJobAIFeedback(aiResult, new Date().toISOString());
    aiPayload = {
      ai_status: feedback.ai_status,
      ai_feedback_summary: feedback.ai_feedback_summary,
      ai_strengths: feedback.ai_strengths,
      ai_improvements: feedback.ai_improvements,
      ai_warnings: feedback.ai_warnings,
      ai_suggested_changes: feedback.ai_suggested_changes,
      ai_last_reviewed_at: feedback.ai_last_reviewed_at,
      ai_score: aiResult.ai_score,
    };
  } catch {
    aiPayload = { ai_status: 'error' };
  }

  const overall = computeOverallScore(structureScore, aiScore);

  const { error: updateError } = await supabase
    .from('jobs')
    .update({
      review_status: 'submitted',
      submitted_at: new Date().toISOString(),
      structure_score: structureScore,
      overall_score: overall,
      ...aiPayload,
    })
    .eq('id', jobId);

  if (updateError) return { error: updateError.message };
  return { error: null, structure_score: structureScore, ai_score: aiScore ?? undefined, overall_score: overall };
}

async function logHistory(
  jobId: string,
  action: string,
  newStatus: string,
  oldStatus: string | null,
  note: string | null,
  createdBy: string | null,
  metadata?: Record<string, unknown>
) {
  await supabase.from('job_review_history').insert({
    job_id: jobId,
    action,
    old_status: oldStatus,
    new_status: newStatus,
    note,
    created_by: createdBy,
    metadata: metadata ?? {},
  });
}

export async function setUnderReview(jobId: string, adminId: string): Promise<{ error: string | null }> {
  const { data: job } = await supabase.from('jobs').select('review_status').eq('id', jobId).single();
  const oldStatus = (job as { review_status?: string } | null)?.review_status ?? null;

  const { error } = await supabase
    .from('jobs')
    .update({ review_status: 'under_review' })
    .eq('id', jobId);

  if (error) return { error: error.message };
  await logHistory(jobId, 'under_review', 'under_review', oldStatus, null, adminId);
  return { error: null };
}

export async function requestChanges(
  jobId: string,
  adminId: string,
  reason: string
): Promise<{ error: string | null }> {
  const { data: job } = await supabase.from('jobs').select('review_status').eq('id', jobId).single();
  const oldStatus = (job as { review_status?: string } | null)?.review_status ?? null;

  const { error } = await supabase
    .from('jobs')
    .update({
      review_status: 'changes_requested',
      changes_requested_at: new Date().toISOString(),
      changes_requested_by: adminId,
      changes_requested_reason: reason,
    })
    .eq('id', jobId);

  if (error) return { error: error.message };
  await logHistory(jobId, 'changes_requested', 'changes_requested', oldStatus, reason, adminId);
  return { error: null };
}

export async function approveJob(jobId: string, adminId: string): Promise<{ error: string | null }> {
  const { data: job } = await supabase.from('jobs').select('review_status').eq('id', jobId).single();
  const oldStatus = (job as { review_status?: string } | null)?.review_status ?? null;

  const { error } = await supabase
    .from('jobs')
    .update({
      review_status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: adminId,
    })
    .eq('id', jobId);

  if (error) return { error: error.message };
  await logHistory(jobId, 'approve', 'approved', oldStatus, null, adminId);
  return { error: null };
}

export async function rejectJob(
  jobId: string,
  adminId: string,
  reason: string
): Promise<{ error: string | null }> {
  const { data: job } = await supabase.from('jobs').select('review_status').eq('id', jobId).single();
  const oldStatus = (job as { review_status?: string } | null)?.review_status ?? null;

  const { error } = await supabase
    .from('jobs')
    .update({
      review_status: 'rejected',
      rejected_at: new Date().toISOString(),
      rejected_by: adminId,
      rejection_reason: reason,
    })
    .eq('id', jobId);

  if (error) return { error: error.message };
  await logHistory(jobId, 'reject', 'rejected', oldStatus, reason, adminId);
  return { error: null };
}

export async function publishJob(jobId: string, adminId: string): Promise<{ error: string | null }> {
  const { data: job } = await supabase.from('jobs').select('review_status').eq('id', jobId).single();
  const current = (job as { review_status?: string } | null)?.review_status;

  if (current !== 'approved') {
    return { error: 'Alleen goedgekeurde opdrachten kunnen worden gepubliceerd.' };
  }

  const { error } = await supabase
    .from('jobs')
    .update({
      review_status: 'published',
      status: 'PUBLISHED',
      published_at: new Date().toISOString(),
      published_by: adminId,
    })
    .eq('id', jobId);

  if (error) return { error: error.message };
  await logHistory(jobId, 'publish', 'published', current, null, adminId);
  return { error: null };
}

export async function getJobReviewHistory(jobId: string) {
  const { data, error } = await supabase
    .from('job_review_history')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getJobAdminNotes(jobId: string) {
  const { data, error } = await supabase
    .from('job_admin_notes')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function addJobAdminNote(
  jobId: string,
  note: string,
  createdBy: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.from('job_admin_notes').insert({
    job_id: jobId,
    note,
    created_by: createdBy,
  });
  return { error: error?.message ?? null };
}
