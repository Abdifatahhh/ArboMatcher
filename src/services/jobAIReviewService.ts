/**
 * AI review for job content. Provider-agnostic; backend/edge should call AI.
 * Stub implementation returns mock feedback when AI is unavailable.
 */

import type { Job } from '../lib/types';
import type { JobAIFeedback } from '../lib/jobReviewTypes';
import { getContractFormLabel, getRemoteTypeLabel } from '../lib/opdrachtConstants';

export interface JobAIReviewInput {
  title: string;
  description: string;
  region: string | null;
  remote_type: string | null;
  job_type: string | null;
  start_date: string | null;
  duration_weeks: number | null;
  hours_per_week: number | null;
  rate_min: number | null;
  rate_max: number | null;
  target_profession: string | null;
}

export interface JobAIReviewResult {
  ai_score: number;
  ai_feedback_summary: string;
  ai_strengths: string[];
  ai_improvements: string[];
  ai_warnings: string[];
  ai_suggested_changes: string[];
}

function formatJobForAI(job: JobAIReviewInput): string {
  const parts: string[] = [];
  parts.push(`Titel: ${job.title || '(ontbreekt)'}`);
  parts.push(`Beschrijving: ${(job.description || '').slice(0, 2000)}`);
  if (job.region) parts.push(`Regio: ${job.region}`);
  if (job.remote_type) parts.push(`Werkwijze: ${getRemoteTypeLabel(job.remote_type)}`);
  if (job.job_type) parts.push(`Contractvorm: ${getContractFormLabel(job.job_type)}`);
  if (job.start_date) parts.push(`Startdatum: ${job.start_date}`);
  if (job.duration_weeks != null) parts.push(`Duur: ${job.duration_weeks} weken`);
  if (job.hours_per_week != null) parts.push(`Uren/week: ${job.hours_per_week}`);
  if (job.rate_min != null || job.rate_max != null) parts.push(`Tarief: ${job.rate_min ?? '?'} - ${job.rate_max ?? '?'}`);
  if (job.target_profession) parts.push(`Type professional: ${job.target_profession}`);
  return parts.join('\n');
}

function stubReview(input: JobAIReviewInput): JobAIReviewResult {
  const improvements: string[] = [];
  const warnings: string[] = [];
  const strengths: string[] = [];
  let score = 50;

  if (input.title?.trim()) {
    strengths.push('Titel is ingevuld');
    score += 5;
  } else improvements.push('Voeg een duidelijke titel toe');

  if ((input.description?.trim() ?? '').length >= 100) {
    strengths.push('Beschrijving heeft voldoende lengte');
    score += 10;
  } else improvements.push('Beschrijving is te kort of te algemeen; maak de taakomschrijving concreter');

  if (input.job_type) {
    score += 5;
  } else improvements.push('Geef aan of het om ZZP, detachering of loondienst gaat');

  if (input.remote_type) score += 5;
  if (input.start_date) score += 5; else improvements.push('Gewenste startdatum ontbreekt');
  if (input.rate_min != null || input.rate_max != null) score += 5; else improvements.push('Voeg tarief of salarisindicatie toe');
  if (input.hours_per_week != null) score += 5; else improvements.push('Voeg uren per week toe');
  if (input.duration_weeks != null) score += 5;
  if (input.target_profession) {
    score += 5;
    strengths.push('Doelgroep (type professional) is aangegeven');
  } else {
    improvements.push('Benoem gewenste type professional (bijv. bedrijfsarts, arbo-arts, POB)');
  }

  if (input.region && input.remote_type !== 'REMOTE') strengths.push('Locatie is ingevuld');

  const summary = improvements.length > 0
    ? `De opdracht kan sterker door: ${improvements.slice(0, 3).join('; ')}.`
    : 'De opdracht is inhoudelijk goed opgezet.';

  return {
    ai_score: Math.min(100, score),
    ai_feedback_summary: summary,
    ai_strengths: strengths.length ? strengths : ['Opdracht heeft een duidelijke structuur'],
    ai_improvements: improvements,
    ai_warnings: warnings,
    ai_suggested_changes: improvements.map((t) => `- ${t}`),
  };
}

/**
 * Run AI review. In production this would call an edge function or API with a real AI provider.
 * Fallback: stub review so structure score and flow still work.
 */
export async function runJobAIReview(
  job: JobAIReviewInput | Job,
  _options?: { provider?: string }
): Promise<JobAIReviewResult> {
  const input: JobAIReviewInput = 'title' in job && typeof job.title === 'string'
    ? {
        title: job.title,
        description: job.description,
        region: job.region ?? null,
        remote_type: job.remote_type ?? null,
        job_type: job.job_type ?? null,
        start_date: job.start_date ?? null,
        duration_weeks: job.duration_weeks ?? null,
        hours_per_week: job.hours_per_week ?? null,
        rate_min: job.rate_min ?? null,
        rate_max: job.rate_max ?? null,
        target_profession: job.target_profession ?? null,
      }
    : job as JobAIReviewInput;

  try {
    return stubReview(input);
  } catch {
    return stubReview(input);
  }
}

export function toJobAIFeedback(
  result: JobAIReviewResult,
  lastReviewedAt: string
): Omit<JobAIFeedback, 'ai_status'> & { ai_status: 'done' } {
  return {
    ai_status: 'done',
    ai_feedback_summary: result.ai_feedback_summary,
    ai_strengths: result.ai_strengths,
    ai_improvements: result.ai_improvements,
    ai_warnings: result.ai_warnings,
    ai_suggested_changes: result.ai_suggested_changes,
    ai_last_reviewed_at: lastReviewedAt,
  };
}
