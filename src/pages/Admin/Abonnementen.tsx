import { useState, useEffect } from 'react';
import { listSubscriptions, updateSubscription } from '../../services/adminSubscriptionsService';
import type { PlanFilter, StatusFilter } from '../../components/Admin/SubscriptionsFilters';
import { SubscriptionsFilters } from '../../components/Admin/SubscriptionsFilters';
import { SubscriptionsTable } from '../../components/Admin/SubscriptionsTable';
import type { AdminSubscriptionRow } from '../../services/adminSubscriptionsService';
import { demoSubscriptions } from '../../data/adminDemoData';
import { CreditCard, Info, AlertCircle } from 'lucide-react';

const PAGE_SIZE = 20;

export default function AdminAbonnementen() {
  const [data, setData] = useState<AdminSubscriptionRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [plan, setPlan] = useState<PlanFilter>('');
  const [status, setStatus] = useState<StatusFilter>('');
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await listSubscriptions({
        plan: plan || undefined,
        status: status || undefined,
        search: search.trim() || undefined,
        page,
        pageSize: PAGE_SIZE,
      });
      if (res.data.length > 0) {
        setData(res.data);
        setTotal(res.total);
        setIsDemo(false);
      } else {
        const term = search.trim().toLowerCase();
        const filtered = demoSubscriptions
          .filter((s) => {
            if (plan && s.plan !== plan) return false;
            if (status && s.status !== status) return false;
            if (term) {
              const prof = s.profiles;
              const matchName = prof?.full_name?.toLowerCase().includes(term);
              const matchEmail = prof?.email?.toLowerCase().includes(term);
              if (!matchName && !matchEmail) return false;
            }
            return true;
          })
          .map((s) => ({ subscription: s, profile: s.profiles }));
        setTotal(filtered.length);
        const from = (page - 1) * PAGE_SIZE;
        setData(filtered.slice(from, from + PAGE_SIZE));
        setIsDemo(true);
      }
    } catch {
      setData([]);
      setTotal(0);
      setIsDemo(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, plan, status, search]);

  const handleUpdate = async (
    id: string,
    updates: { plan?: import('../../services/adminSubscriptionsService').SubscriptionPlan; status?: import('../../services/adminSubscriptionsService').SubscriptionStatus; renew_at?: string | null }
  ) => {
    setMessage(null);
    const previousData = data;
    setData(previousData.map((row) => (row.subscription.id === id ? { ...row, subscription: { ...row.subscription, ...updates } } : row)));
    if (isDemo) return;
    const { error } = await updateSubscription(id, updates);
    if (error) {
      setData(previousData);
      setMessage({ type: 'error', text: 'Bijwerken mislukt.' });
      return;
    }
    setMessage({ type: 'success', text: 'Abonnement bijgewerkt.' });
    load();
  };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-6">
      {isDemo && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 shadow-sm">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-900 text-sm">Demo-data wordt getoond. Wijzigingen worden niet opgeslagen.</p>
        </div>
      )}
      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${message.type === 'success' ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
          <AlertCircle className={`w-5 h-5 flex-shrink-0 ${message.type === 'success' ? 'text-emerald-600' : 'text-red-600'}`} />
          <span className={message.type === 'success' ? 'text-emerald-900' : 'text-red-900'}>{message.text}</span>
        </div>
      )}
      <h1 className="text-3xl font-bold text-[#0F172A] mb-2 flex items-center gap-2">
        <CreditCard className="w-8 h-8 text-[#4FA151]" />
        Abonnementen
      </h1>
      <p className="text-emerald-700/80 text-sm mb-6">Beheer abonnementen en verlengdata</p>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100 shadow-md p-4 mb-6">
        <SubscriptionsFilters plan={plan} status={status} search={search} onPlanChange={(v) => { setPlan(v); setPage(1); }} onStatusChange={(v) => { setStatus(v); setPage(1); }} onSearchChange={(v) => { setSearch(v); setPage(1); }} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16 rounded-xl bg-white/60 border border-emerald-100">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-200 border-t-[#4FA151]" />
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-emerald-100 shadow-md text-center">
          <CreditCard className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Geen abonnementen gevonden</h3>
          <p className="text-gray-500">Pas filters aan of zoek op een andere term.</p>
        </div>
      ) : (
        <>
          <SubscriptionsTable rows={data} onUpdate={handleUpdate} isDemo={isDemo} />
          <div className="mt-4 flex items-center justify-between px-1">
            <p className="text-sm text-emerald-800/80 font-medium">{from}–{to} van {total}</p>
            <div className="flex gap-2">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="px-4 py-2 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-800 bg-white hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition">Vorige</button>
              <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="px-4 py-2 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-800 bg-white hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition">Volgende</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
