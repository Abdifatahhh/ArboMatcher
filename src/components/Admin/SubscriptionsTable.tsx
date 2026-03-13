import { Link } from 'react-router-dom';
import type { AdminSubscriptionRow, SubscriptionPlan, SubscriptionStatus } from '../../services/adminSubscriptionsService';
import { AdminBadge } from './AdminBadge';
import { tableStyles as t } from './AdminTableWrapper';
import { filterStyles as f } from './AdminFiltersBar';

const PLANS: SubscriptionPlan[] = ['GRATIS', 'PRO'];
const PLAN_LABELS: Record<SubscriptionPlan, string> = { GRATIS: 'Gratis', PRO: 'Pro' };

const STATUSES: SubscriptionStatus[] = ['ACTIVE', 'CANCELLED', 'EXPIRED'];
const STATUS_LABELS: Record<SubscriptionStatus, string> = { ACTIVE: 'Actief', CANCELLED: 'Geannuleerd', EXPIRED: 'Verlopen' };
const STATUS_VARIANT: Record<SubscriptionStatus, 'success' | 'neutral' | 'danger'> = { ACTIVE: 'success', CANCELLED: 'neutral', EXPIRED: 'danger' };

function normalizePlan(p: string | undefined | null): SubscriptionPlan {
  if (PLANS.includes(p as SubscriptionPlan)) return p as SubscriptionPlan;
  return 'GRATIS';
}
function normalizeStatus(s: string | undefined | null): SubscriptionStatus {
  if (STATUSES.includes(s as SubscriptionStatus)) return s as SubscriptionStatus;
  return 'ACTIVE';
}

interface SubscriptionsTableProps {
  rows: AdminSubscriptionRow[];
  onUpdate: (id: string, updates: { plan?: SubscriptionPlan; status?: SubscriptionStatus; renew_at?: string | null }) => void;
  isDemo?: boolean;
}

export function SubscriptionsTable({ rows, onUpdate }: SubscriptionsTableProps) {
  return (
    <table className={t.table}>
      <thead className={t.thead}>
        <tr>
          <th className={t.th}>Gebruiker</th>
          <th className={t.th}>Plan</th>
          <th className={t.th}>Status</th>
          <th className={t.th}>Verlengdatum</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ subscription, profile }) => {
          const st = normalizeStatus(subscription.status);
          return (
            <tr key={subscription.id} className={t.row}>
              <td className={t.td}>
                <Link to={`/admin/gebruikers/${subscription.user_id}`} className={t.link}>{profile?.full_name || '—'}</Link>
                <div className={t.secondary}>{profile?.email || subscription.user_id}</div>
              </td>
              <td className={t.td}>
                <select value={normalizePlan(subscription.plan)} onChange={(e) => onUpdate(subscription.id, { plan: e.target.value as SubscriptionPlan })} className={`${f.select} !h-8 text-xs`}>
                  {PLANS.map((p) => <option key={p} value={p}>{PLAN_LABELS[p]}</option>)}
                </select>
              </td>
              <td className={t.td}>
                <div className="flex items-center gap-2">
                  <select value={st} onChange={(e) => onUpdate(subscription.id, { status: e.target.value as SubscriptionStatus })} className={`${f.select} !h-8 text-xs`}>
                    {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                  </select>
                  <AdminBadge variant={STATUS_VARIANT[st]} dot>{STATUS_LABELS[st]}</AdminBadge>
                </div>
              </td>
              <td className={t.td}>{subscription.renew_at ? new Date(subscription.renew_at).toLocaleDateString('nl-NL') : '—'}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
