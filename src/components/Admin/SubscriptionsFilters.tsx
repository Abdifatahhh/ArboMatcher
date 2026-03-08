import type { SubscriptionPlan, SubscriptionStatus } from '../../services/adminSubscriptionsService';

const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  GRATIS: 'Gratis',
  PRO: 'Pro',
};

const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  ACTIVE: 'Actief',
  CANCELLED: 'Geannuleerd',
  EXPIRED: 'Verlopen',
};

export type PlanFilter = '' | SubscriptionPlan;
export type StatusFilter = '' | SubscriptionStatus;

interface SubscriptionsFiltersProps {
  plan: PlanFilter;
  status: StatusFilter;
  search: string;
  onPlanChange: (v: PlanFilter) => void;
  onStatusChange: (v: StatusFilter) => void;
  onSearchChange: (v: string) => void;
}

export function SubscriptionsFilters({
  plan,
  status,
  search,
  onPlanChange,
  onStatusChange,
  onSearchChange,
}: SubscriptionsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div>
        <label className="block text-xs font-medium text-emerald-800/80 mb-1">Plan</label>
        <select value={plan} onChange={(e) => onPlanChange(e.target.value as PlanFilter)} className="px-4 py-2.5 bg-white border border-emerald-200/80 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition">
          <option value="">Alle</option>
          {(Object.keys(PLAN_LABELS) as SubscriptionPlan[]).map((p) => (
            <option key={p} value={p}>{PLAN_LABELS[p]}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-emerald-800/80 mb-1">Status</label>
        <select value={status} onChange={(e) => onStatusChange(e.target.value as StatusFilter)} className="px-4 py-2.5 bg-white border border-emerald-200/80 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition">
          <option value="">Alle</option>
          {(Object.keys(STATUS_LABELS) as SubscriptionStatus[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-emerald-800/80 mb-1">Zoeken</label>
        <input type="search" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Naam of e-mail..." className="w-full px-4 py-2.5 bg-white border border-emerald-200/80 rounded-xl text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition" />
      </div>
    </div>
  );
}
