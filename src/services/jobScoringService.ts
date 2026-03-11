/**
 * Structure score and checklist for jobs.
 * Pure functions; no Supabase. Used in opdrachtgever form and admin.
 */

import type { Job } from '../lib/types';
import type { Employer } from '../lib/types';
import type { ChecklistItem, ChecklistItemStatus, JobChecklistResult, JobScores } from '../lib/jobReviewTypes';

const STRUCTURE_WEIGHT = 0.6;
const AI_WEIGHT = 0.4;
const MIN_DESCRIPTION_LENGTH = 100;

export interface JobFormData {
  title?: string | null;
  description?: string | null;
  region?: string | null;
  remote_type?: string | null;
  job_type?: string | null;
  start_date?: string | null;
  duration_weeks?: number | null;
  hours_per_week?: number | null;
  rate_min?: number | null;
  rate_max?: number | null;
  target_profession?: string | null;
  company_name?: string | null;
}

function statusOf(ok: boolean, required: boolean): ChecklistItemStatus {
  if (ok) return 'complete';
  return required ? 'critical' : 'missing';
}

function partialStatus(hasSome: boolean, hasEnough: boolean): ChecklistItemStatus {
  if (hasEnough) return 'complete';
  if (hasSome) return 'partial';
  return 'missing';
}

export function buildChecklist(
  data: JobFormData | Job,
  employer?: Employer | null
): JobChecklistResult {
  const title = data.title?.trim() ?? '';
  const desc = (data.description?.trim() ?? '') as string;
  const hasRate = (data as { rate_min?: number | null; rate_max?: number | null }).rate_min != null
    || (data as { rate_min?: number | null; rate_max?: number | null }).rate_max != null;
  const companyName = (data as JobFormData).company_name ?? employer?.company_name ?? '';

  const items: ChecklistItem[] = [
    {
      id: 'title_desc',
      label: 'Titel en beschrijving opdracht',
      status: title && desc.length >= MIN_DESCRIPTION_LENGTH ? 'complete' : desc.length > 0 ? 'partial' : 'missing',
      hint: desc.length > 0 && desc.length < MIN_DESCRIPTION_LENGTH ? `Beschrijving minimaal ${MIN_DESCRIPTION_LENGTH} tekens` : undefined,
    },
    {
      id: 'requirements_start',
      label: 'Eisen en gewenste startdatum',
      status: statusOf(!!(data.start_date), false),
    },
    {
      id: 'contract_work',
      label: 'Contractvorm en werkwijze',
      status: partialStatus(!!(data.job_type || data.remote_type), !!(data.job_type && data.remote_type)),
    },
    {
      id: 'location',
      label: 'Locatie of remote/hybride',
      status: statusOf(!!data.remote_type && (data.remote_type === 'REMOTE' || data.remote_type === 'HYBRID' ? true : !!data.region), false),
    },
    {
      id: 'rate',
      label: 'Tarief of salarisindicatie',
      status: statusOf(hasRate, false),
    },
    {
      id: 'hours_duration',
      label: 'Uren per week en duur van de opdracht',
      status: partialStatus(
        !!((data as { hours_per_week?: number | null }).hours_per_week ?? (data as { duration_weeks?: number | null }).duration_weeks),
        !!((data as { hours_per_week?: number | null }).hours_per_week && (data as { duration_weeks?: number | null }).duration_weeks)
      ),
    },
    {
      id: 'target_profession',
      label: 'Type professional / doelgroep',
      status: statusOf(!!(data as JobFormData).target_profession?.trim(), false),
    },
    {
      id: 'company',
      label: 'Bedrijfsinformatie',
      status: statusOf(!!companyName?.trim(), false),
    },
  ];

  const completedCount = items.filter((i) => i.status === 'complete').length;
  const totalCount = items.length;
  const structureScore = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return { items, structureScore, completedCount, totalCount };
}

export function computeOverallScore(
  structureScore: number,
  aiScore: number | null,
  structureWeight: number = STRUCTURE_WEIGHT,
  aiWeight: number = AI_WEIGHT
): number {
  if (aiScore == null) return structureScore;
  return Math.round(structureScore * structureWeight + aiScore * aiWeight);
}

export function getScores(
  structureScore: number,
  aiScore: number | null
): JobScores {
  const overall = computeOverallScore(structureScore, aiScore ?? 0);
  return {
    structure_score: structureScore,
    ai_score: aiScore ?? 0,
    overall_score: overall,
    structure_weight: STRUCTURE_WEIGHT,
    ai_weight: AI_WEIGHT,
  };
}

export { STRUCTURE_WEIGHT, AI_WEIGHT, MIN_DESCRIPTION_LENGTH };
