import { getScoreLabel } from '../../lib/jobReviewTypes';

interface JobScoreBadgeProps {
  score: number;
  size?: 'sm' | 'md';
  showLabel?: boolean;
}

const colorByScore = (score: number) => {
  if (score >= 85) return 'bg-emerald-100 text-emerald-800';
  if (score >= 70) return 'bg-green-100 text-green-800';
  if (score >= 50) return 'bg-amber-100 text-amber-800';
  return 'bg-red-100 text-red-800';
};

export function JobScoreBadge({ score, size = 'md', showLabel = true }: JobScoreBadgeProps) {
  const label = getScoreLabel(score);
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${sizeClass} ${colorByScore(score)}`}
      title={label}
    >
      <span>{score}%</span>
      {showLabel && <span className="opacity-90">{label}</span>}
    </span>
  );
}
