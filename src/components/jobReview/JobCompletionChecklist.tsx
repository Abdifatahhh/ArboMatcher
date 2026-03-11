import type { ChecklistItem } from '../../lib/jobReviewTypes';
import { Check, AlertTriangle, XCircle, Minus } from 'lucide-react';

interface JobCompletionChecklistProps {
  items: ChecklistItem[];
  compact?: boolean;
}

const statusConfig = {
  complete: { icon: Check, className: 'text-emerald-600', bg: 'bg-emerald-50' },
  partial: { icon: AlertTriangle, className: 'text-amber-600', bg: 'bg-amber-50' },
  missing: { icon: Minus, className: 'text-gray-400', bg: 'bg-gray-50' },
  critical: { icon: XCircle, className: 'text-red-600', bg: 'bg-red-50' },
} as const;

export function JobCompletionChecklist({ items, compact }: JobCompletionChecklistProps) {
  return (
    <ul className={compact ? 'space-y-1' : 'space-y-2'}>
      {items.map((item) => {
        const config = statusConfig[item.status];
        const Icon = config.icon;
        return (
          <li
            key={item.id}
            className={`flex items-center gap-2 ${compact ? 'text-sm' : ''} ${config.bg} rounded-lg px-2 py-1.5`}
          >
            <Icon className={`w-4 h-4 flex-shrink-0 ${config.className}`} />
            <span className="flex-1 text-gray-800">{item.label}</span>
            {item.hint && <span className="text-xs text-gray-500">{item.hint}</span>}
          </li>
        );
      })}
    </ul>
  );
}
