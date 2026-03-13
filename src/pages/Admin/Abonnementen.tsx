import { useState, useEffect } from 'react';
import { listSubscriptions, updateSubscription } from '../../services/adminSubscriptionsService';
import type { PlanFilter, StatusFilter } from '../../components/Admin/SubscriptionsFilters';
import { SubscriptionsFilters } from '../../components/Admin/SubscriptionsFilters';
import { SubscriptionsTable } from '../../components/Admin/SubscriptionsTable';
import type { AdminSubscriptionRow } from '../../services/adminSubscriptionsService';
import { demoSubscriptions } from '../../data/adminDemoData';
import { AdminPage, AdminPageHeader, AdminFiltersBar, AdminTableWrapper, AdminEmptyState, AdminLoadingState, AdminAlert, AdminPagination } from '../../components/Admin/adminUI';
import { CreditCard } from 'lucide-react';

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
      const res = await listSubscriptions({ plan: plan || undefined, status: status || undefined, search: search.trim() || undefined, page, pageSize: PAGE_SIZE });
      if (res.data.length > 0) { setData(res.data); setTotal(res.total); setIsDemo(false); }
      else {
        const term = search.trim().toLowerCase();
        const filtered = demoSubscriptions.filter((s) => {
          if (plan && s.plan !== plan) return false;
          if (status && s.status !== status) return false;
          if (term) { const prof = s.profiles; if (!prof?.full_name?.toLowerCase().includes(term) && !prof?.email?.toLowerCase().includes(term)) return false; }
          return true;
        }).map((s) => ({ subscription: s, profile: s.profiles }));
        setTotal(filtered.length);
        const from = (page - 1) * PAGE_SIZE;
        setData(filtered.slice(from, from + PAGE_SIZE));
        setIsDemo(true);
      }
    } catch { setData([]); setTotal(0); setIsDemo(false); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, plan, status, search]);

  const handleUpdate = async (id: string, updates: { plan?: import('../../services/adminSubscriptionsService').SubscriptionPlan; status?: import('../../services/adminSubscriptionsService').SubscriptionStatus; renew_at?: string | null }) => {
    setMessage(null);
    const previousData = data;
    setData(previousData.map((row) => (row.subscription.id === id ? { ...row, subscription: { ...row.subscription, ...updates } } : row)));
    if (isDemo) return;
    const { error } = await updateSubscription(id, updates);
    if (error) { setData(previousData); setMessage({ type: 'error', text: 'Bijwerken mislukt.' }); return; }
    setMessage({ type: 'success', text: 'Abonnement bijgewerkt.' });
    load();
  };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminPage>
      <AdminPageHeader icon={CreditCard} title="Abonnementen" description="Beheer abonnementen en verlengdata" />
      {isDemo && <AdminAlert variant="warning">Demo-data wordt getoond. Wijzigingen worden niet opgeslagen.</AdminAlert>}
      {message && <AdminAlert variant={message.type === 'success' ? 'success' : 'error'} onClose={() => setMessage(null)}>{message.text}</AdminAlert>}

      <AdminFiltersBar>
        <SubscriptionsFilters plan={plan} status={status} search={search} onPlanChange={(v) => { setPlan(v); setPage(1); }} onStatusChange={(v) => { setStatus(v); setPage(1); }} onSearchChange={(v) => { setSearch(v); setPage(1); }} />
      </AdminFiltersBar>

      {loading ? <AdminLoadingState /> : data.length === 0 ? (
        <AdminTableWrapper>
          <AdminEmptyState icon={CreditCard} title="Geen abonnementen gevonden" description="Pas filters aan of zoek op een andere term." />
        </AdminTableWrapper>
      ) : (
        <>
          <AdminTableWrapper>
            <SubscriptionsTable rows={data} onUpdate={handleUpdate} isDemo={isDemo} />
          </AdminTableWrapper>
          <AdminPagination page={page} totalPages={totalPages} from={from} to={to} total={total} onPageChange={setPage} />
        </>
      )}
    </AdminPage>
  );
}
