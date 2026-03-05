import { Link } from 'react-router-dom';
import type { AdminSubscriptionRow } from '../../services/adminSubscriptionsService';
import type { SubscriptionPlan, SubscriptionStatus } from '../../services/adminSubscriptionsService';

const PLAN_LABELS: Record<SubscriptionPlan, string> = {
  BASIC: 'Basic',
  PRO: 'Pro',
  ENTERPRISE: 'Enterprise',
  PREMIUM_DOCTOR: 'Premium arts',
};

const STATUS_STYLE: Record<SubscriptionStatus, string> = {
  ACTIVE: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-gray-100 text-gray-800',
  EXPIRED: 'bg-red-100 text-red-800',
};

interface SubscriptionsTableProps {
  rows: AdminSubscriptionRow[];
  onUpdate: (id: string, updates: { plan?: SubscriptionPlan; status?: SubscriptionStatus; renew_at?: string | null }) => void;
  isDemo?: boolean;
}

export function SubscriptionsTable({ rows, onUpdate, isDemo }: SubscriptionsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gebruiker</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verlengdatum</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map(({ subscription, profile }) => (
              <tr key={subscription.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link
                    to={`/admin/gebruikers/${subscription.user_id}`}
                    className="text-sm font-medium text-[#0F172A] hover:text-[#4FA151] hover:underline"
                  >
                    {profile?.full_name || '—'}
                  </Link>
                  <div className="text-xs text-gray-500">{profile?.email || subscription.user_id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={subscription.plan}
                    onChange={(e) => onUpdate(subscription.id, { plan: e.target.value as SubscriptionPlan })}
                    disabled={isDemo}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#0F172A] disabled:opacity-60"
                  >
                    {(Object.keys(PLAN_LABELS) as SubscriptionPlan[]).map((p) => (
                      <option key={p} value={p}>{PLAN_LABELS[p]}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={subscription.status}
                    onChange={(e) => onUpdate(subscription.id, { status: e.target.value as SubscriptionStatus })}
                    disabled={isDemo}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-[#0F172A] disabled:opacity-60"
                  >
                    <option value="ACTIVE">Actief</option>
                    <option value="CANCELLED">Geannuleerd</option>
                    <option value="EXPIRED">Verlopen</option>
                  </select>
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLE[subscription.status]}`}>
                    {subscription.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subscription.renew_at ? new Date(subscription.renew_at).toLocaleDateString('nl-NL') : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
