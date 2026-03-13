import { useState, useEffect } from 'react';
import { listApplications, updateApplicationStatus } from '../../services/adminApplicationsService';
import type { ApplicationStatusFilter, AdminApplicationRow } from '../../services/adminApplicationsService';
import { ApplicationsFilters } from '../../components/Admin/ApplicationsFilters';
import { ApplicationsTable } from '../../components/Admin/ApplicationsTable';
import { demoApplications } from '../../data/adminDemoData';
import { AdminPage, AdminPageHeader, AdminFiltersBar, AdminTableWrapper, AdminEmptyState, AdminLoadingState, AdminAlert, AdminPagination } from '../../components/Admin/adminUI';
import { FileText } from 'lucide-react';

const PAGE_SIZE = 20;

export default function AdminReacties() {
  const [data, setData] = useState<AdminApplicationRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [status, setStatus] = useState<ApplicationStatusFilter>('');
  const [search, setSearch] = useState('');
  const [statusError, setStatusError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await listApplications({ status: status || undefined, search: search.trim() || undefined, page, pageSize: PAGE_SIZE });
      if (res.data.length > 0) { setData(res.data); setTotal(res.total); setIsDemo(false); }
      else {
        const term = search.trim().toLowerCase();
        const filtered = demoApplications.filter((a) => {
          if (status && a.status !== status) return false;
          if (term) {
            const jobTitle = a.jobs?.title?.toLowerCase() ?? '';
            const docName = (a.professionals as any)?.profiles?.full_name?.toLowerCase() ?? '';
            const docEmail = (a.professionals as any)?.profiles?.email?.toLowerCase() ?? '';
            if (!jobTitle.includes(term) && !docName.includes(term) && !docEmail.includes(term)) return false;
          }
          return true;
        });
        setTotal(filtered.length);
        const from = (page - 1) * PAGE_SIZE;
        setData(filtered.slice(from, from + PAGE_SIZE).map((a) => ({
          application: a,
          job: a.jobs ?? null,
          doctor: a.professionals ?? null,
          profile: (a.professionals as any)?.profiles ?? null,
        })));
        setIsDemo(true);
      }
    } catch { setData([]); setTotal(0); setIsDemo(false); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, status, search]);

  const handleStatusChange = async (applicationId: string, newStatus: 'PENDING' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED') => {
    setStatusError(null);
    const previousData = data;
    setData(previousData.map((r) => (r.application.id === applicationId ? { ...r, application: { ...r.application, status: newStatus } } : r)));
    if (isDemo) return;
    const { error } = await updateApplicationStatus(applicationId, newStatus);
    if (error) { setData(previousData); setStatusError('Status kon niet worden opgeslagen. Probeer opnieuw.'); return; }
    load();
  };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminPage>
      <AdminPageHeader icon={FileText} title="Sollicitaties / Reacties" description="Overzicht van alle sollicitaties op opdrachten" />
      {isDemo && <AdminAlert variant="warning">Demo-data wordt getoond. Status wijzigen wordt niet opgeslagen.</AdminAlert>}
      {statusError && <AdminAlert variant="error" onClose={() => setStatusError(null)}>{statusError}</AdminAlert>}

      <AdminFiltersBar>
        <ApplicationsFilters status={status} search={search} onStatusChange={(v) => { setStatus(v); setPage(1); }} onSearchChange={(v) => { setSearch(v); setPage(1); }} />
      </AdminFiltersBar>

      {loading ? <AdminLoadingState /> : data.length === 0 ? (
        <AdminTableWrapper>
          <AdminEmptyState icon={FileText} title="Geen sollicitaties gevonden" description="Pas filters aan of zoek op een andere term." />
        </AdminTableWrapper>
      ) : (
        <>
          <AdminTableWrapper>
            <ApplicationsTable rows={data} onStatusChange={handleStatusChange} isDemo={isDemo} />
          </AdminTableWrapper>
          <AdminPagination page={page} totalPages={totalPages} from={from} to={to} total={total} onPageChange={setPage} />
        </>
      )}
    </AdminPage>
  );
}
