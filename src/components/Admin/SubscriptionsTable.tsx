import { Link } from 'react-router-dom';
import type { AdminSubscriptionRow } from '../../services/adminSubscriptionsService';
import type { SubscriptionPlan, SubscriptionStatus } from '../../services/adminSubscriptionsService';

const PLANS: SubscriptionPlan[] = ['GRATIS', 'PRO'];
const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  GRATIS: 'Gratis',
  PRO: 'Pro',
};

const STATUSES: SubscriptionStatus[] = ['ACTIVE', 'CANCELLED', 'EXPIRED'];
const STATUS_LABELS: Record<SubscriptionStatus, string> = {
  ACTIVE: 'Actief',
  CANCELLED: 'Geannuleerd',
  EXPIRED: 'Verlopen',
};

const STATUS_STYLE: Record<SubscriptionStatus, string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  CANCELLED: 'bg-gray-100 text-gray-800 border border-gray-200',
  EXPIRED: 'bg-red-100 text-red-800 border border-red-200',
};

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

export function SubscriptionsTable({ rows, onUpdate, isDemo }: SubscriptionsTableProps) {
  return (
    <div className="rounded-xl border border-emerald-100 overflow-hidden shadow-md bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[#4FA151] border-b border-[#3E8E45]">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Gebruiker</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Verlengdatum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {rows.map(({ subscription, profile }, idx) => {
              const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/30';
              return (
                <tr key={subscription.id} className={`${rowBg} hover:bg-emerald-50/50 transition-colors`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link to={`/admin/gebruikers/${subscription.user_id}`} className="text-sm font-semibold text-[#0F172A] hover:text-[#4FA151] hover:underline transition">{profile?.full_name || '—'}</Link>
                    <div className="text-xs text-gray-500">{profile?.email || subscription.user_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={normalizePlan(subscription.plan)}
                      onChange={(e) => onUpdate(subscription.id, { plan: e.target.value as SubscriptionPlan })}
                      className="text-sm border border-[#4FA151]/30 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] bg-white min-w-[120px]"
                    >
                      {PLANS.map((p) => <option key={p} value={p}>{PLAN_LABELS[p]}</option>)}
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={normalizeStatus(subscription.status)}
                      onChange={(e) => onUpdate(subscription.id, { status: e.target.value as SubscriptionStatus })}
                      className="text-sm border border-[#4FA151]/30 rounded-xl px-3 py-2 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] bg-white min-w-[120px] mr-2"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                    </select>
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${STATUS_STYLE[normalizeStatus(subscription.status)] ?? 'bg-gray-100 text-gray-800'}`}>{STATUS_LABELS[normalizeStatus(subscription.status)]}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{subscription.renew_at ? new Date(subscription.renew_at).toLocaleDateString('nl-NL') : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
