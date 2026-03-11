import { JobScoreBadge } from './JobScoreBadge';
import { JobCompletionChecklist } from './JobCompletionChecklist';
import { getScoreLabel } from '../../lib/jobReviewTypes';
import type { JobChecklistResult } from '../../lib/jobReviewTypes';
import type { JobScores } from '../../services/jobScoringService';
import { SUBMISSION_STATUS_MESSAGES } from '../../lib/jobReviewTypes';
import { Sparkles } from 'lucide-react';

interface JobQualityScoreCardProps {
  checklist: JobChecklistResult;
  scores?: JobScores | null;
  reviewStatus?: string | null;
  aiSummary?: string | null;
  aiImprovements?: string[] | null;
  onImproveClick?: () => void;
  compact?: boolean;
}

function getSubmissionMessage(
  overallScore: number,
  reviewStatus: string | undefined | null
): string {
  if (reviewStatus === 'submitted' || reviewStatus === 'under_review') return SUBMISSION_STATUS_MESSAGES.pending_review;
  if (reviewStatus === 'changes_requested') return SUBMISSION_STATUS_MESSAGES.changes_requested;
  if (reviewStatus === 'approved') return SUBMISSION_STATUS_MESSAGES.approved;
  if (overallScore >= 70) return SUBMISSION_STATUS_MESSAGES.ready;
  if (overallScore >= 50) return SUBMISSION_STATUS_MESSAGES.improve;
  return 'Vul verplichte velden in voor een hogere score';
}

export function JobQualityScoreCard({
  checklist,
  scores,
  reviewStatus,
  aiSummary,
  aiImprovements,
  onImproveClick,
  compact,
}: JobQualityScoreCardProps) {
  const overall = scores?.overall_score ?? checklist.structureScore;
  const statusMessage = getSubmissionMessage(overall, reviewStatus);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-semibold text-[#0F172A]">Kwaliteitsscore</h3>
        <JobScoreBadge score={overall} size={compact ? 'sm' : 'md'} showLabel={!compact} />
      </div>
      <div className="p-4 space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Totaal</span>
            <span>{overall}%</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, overall)}%`,
                backgroundColor:
                  overall >= 85 ? '#059669' : overall >= 70 ? '#22c55e' : overall >= 50 ? '#f59e0b' : '#ef4444',
              }}
            />
          </div>
        </div>

        <JobCompletionChecklist items={checklist.items} compact={compact} />

        {(aiSummary || (aiImprovements && aiImprovements.length > 0)) && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> AI-beoordeling
            </p>
            {aiSummary && <p className="text-sm text-gray-700 mb-2">{aiSummary}</p>}
            {aiImprovements && aiImprovements.length > 0 && (
              <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
                {aiImprovements.slice(0, 5).map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        <p className="text-sm font-medium text-[#0F172A]">{statusMessage}</p>

        {onImproveClick && (
          <button
            type="button"
            onClick={onImproveClick}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#4FA151]/30 text-[#4FA151] hover:bg-[#4FA151]/5 font-medium text-sm transition"
          >
            <Sparkles className="w-4 h-4" />
            Verbeter mijn opdracht
          </button>
        )}
      </div>
    </div>
  );
}
