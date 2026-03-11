/**
 * Types for job review workflow, scoring and AI feedback.
 */

export type JobReviewStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'changes_requested'
  | 'approved'
  | 'published'
  | 'rejected'
  | 'closed';

export type ChecklistItemStatus = 'complete' | 'partial' | 'missing' | 'critical';

export interface ChecklistItem {
  id: string;
  label: string;
  status: ChecklistItemStatus;
  hint?: string;
}

export type ScoreLabel = 'Onvoldoende' | 'Redelijk' | 'Goed' | 'Zeer sterk';

export function getScoreLabel(score: number): ScoreLabel {
  if (score >= 85) return 'Zeer sterk';
  if (score >= 70) return 'Goed';
  if (score >= 50) return 'Redelijk';
  return 'Onvoldoende';
}

export function getScoreLabelRange(score: number): { min: number; max: number } {
  if (score >= 85) return { min: 85, max: 100 };
  if (score >= 70) return { min: 70, max: 84 };
  if (score >= 50) return { min: 50, max: 69 };
  return { min: 0, max: 49 };
}

export interface JobScores {
  structure_score: number;
  ai_score: number;
  overall_score: number;
  structure_weight: number;
  ai_weight: number;
}

export interface JobChecklistResult {
  items: ChecklistItem[];
  structureScore: number;
  completedCount: number;
  totalCount: number;
}

export type AIStatus = 'idle' | 'pending' | 'done' | 'error';

export interface JobAIFeedback {
  ai_status: AIStatus;
  ai_feedback_summary: string | null;
  ai_strengths: string[];
  ai_improvements: string[];
  ai_warnings: string[];
  ai_suggested_changes: string[];
  ai_last_reviewed_at: string | null;
}

export interface JobReviewHistoryEntry {
  id: string;
  job_id: string;
  action: string;
  old_status: string | null;
  new_status: string;
  note: string | null;
  metadata: Record<string, unknown>;
  created_by: string | null;
  created_at: string;
}

export interface JobAdminNote {
  id: string;
  job_id: string;
  note: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const REVIEW_STATUS_LABELS: Record<JobReviewStatus, string> = {
  draft: 'Concept',
  submitted: 'Ingediend',
  under_review: 'In beoordeling',
  changes_requested: 'Aanvulling gevraagd',
  approved: 'Goedgekeurd',
  published: 'Gepubliceerd',
  rejected: 'Afgewezen',
  closed: 'Gesloten',
};

export const SUBMISSION_STATUS_MESSAGES: Record<string, string> = {
  ready: 'Klaar om in te dienen',
  improve: 'Nog aanvullen voor betere reacties',
  pending_review: 'Wacht op beoordeling',
  changes_requested: 'Aanvulling gevraagd',
  approved: 'Goedgekeurd voor publicatie',
};

export const TARGET_PROFESSION_OPTIONS = [
  { value: 'bedrijfsarts', label: 'Bedrijfsarts' },
  { value: 'arbo_arts', label: 'Arbo-arts' },
  { value: 'verzekeringsarts', label: 'Verzekeringsarts' },
  { value: 'pob', label: 'Praktijkondersteuner bedrijfsarts (POB)' },
  { value: 'casemanager_verzuim', label: 'Casemanager verzuim' },
] as const;
