import type { SubscriptionPlan, SubscriptionStatus } from '../../services/adminSubscriptionsService';
import { filterStyles as f } from './AdminFiltersBar';

const PLAN_LABELS: Record<SubscriptionPlan, string> = { GRATIS: 'Gratis', PRO: 'Pro' };
const STATUS_LABELS: Record<SubscriptionStatus, string> = { ACTIVE: 'Actief', CANCELLED: 'Geannuleerd', EXPIRED: 'Verlopen' };

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

export function SubscriptionsFilters({ plan, status, search, onPlanChange, onStatusChange, onSearchChange }: SubscriptionsFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className={f.label}>Plan</label>
        <select value={plan} onChange={(e) => onPlanChange(e.target.value as PlanFilter)} className={f.select}>
          <option value="">Alle</option>
          {(Object.keys(PLAN_LABELS) as SubscriptionPlan[]).map((p) => <option key={p} value={p}>{PLAN_LABELS[p]}</option>)}
        </select>
      </div>
      <div>
        <label className={f.label}>Status</label>
        <select value={status} onChange={(e) => onStatusChange(e.target.value as StatusFilter)} className={f.select}>
          <option value="">Alle</option>
          {(Object.keys(STATUS_LABELS) as SubscriptionStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className={f.label}>Zoeken</label>
        <input type="search" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Naam of e-mail..." className={f.input} />
      </div>
    </div>
  );
}
