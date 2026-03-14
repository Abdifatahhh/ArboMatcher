import { REVIEW_STATUS_LABELS } from '../../lib/jobReviewTypes';
import type { JobReviewStatus } from '../../lib/jobReviewTypes';

interface JobReviewStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusColors: Record<string, string> = {
  draft: 'bg-slate-100 text-slate-800',
  submitted: 'bg-blue-100 text-blue-800',
  under_review: 'bg-amber-100 text-amber-800',
  changes_requested: 'bg-orange-100 text-orange-800',
  approved: 'bg-emerald-100 text-emerald-800',
  published: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  closed: 'bg-slate-100 text-slate-600',
};

export function JobReviewStatusBadge({ status, size = 'md' }: JobReviewStatusBadgeProps) {
  const label = REVIEW_STATUS_LABELS[status as JobReviewStatus] ?? status;
  const color = statusColors[status] ?? 'bg-slate-100 text-slate-700';
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span className={`inline-flex rounded-full font-medium ${sizeClass} ${color}`}>
      {label}
    </span>
  );
}
