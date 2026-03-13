import { useState, useEffect } from 'react';
import { listJobs, updateJobStatus } from '../../services/adminJobsService';
import type { JobStatusFilter, AdminJobRow } from '../../services/adminJobsService';
import { JobsFilters } from '../../components/Admin/JobsFilters';
import { JobsTable } from '../../components/Admin/JobsTable';
import { demoJobs } from '../../data/adminDemoData';
import { AdminPage, AdminPageHeader, AdminFiltersBar, AdminTableWrapper, AdminEmptyState, AdminLoadingState, AdminAlert, AdminPagination } from '../../components/Admin/adminUI';
import { Briefcase, Download } from 'lucide-react';
import { exportToCsv } from '../../lib/csvExport';

const PAGE_SIZE = 20;

export default function AdminOpdrachten() {
  const [data, setData] = useState<AdminJobRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [status, setStatus] = useState<JobStatusFilter>('');
  const [search, setSearch] = useState('');
  const [statusError, setStatusError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await listJobs({ status: status || undefined, search: search.trim() || undefined, page, pageSize: PAGE_SIZE });
      if (res.data.length > 0) { setData(res.data); setTotal(res.total); setIsDemo(false); }
      else {
        const term = search.trim().toLowerCase();
        const filtered = demoJobs.filter((j) => {
          if (status && j.status !== status) return false;
          if (term) { if (!j.title?.toLowerCase().includes(term) && !(j.company_name ?? j.employers?.company_name)?.toLowerCase().includes(term)) return false; }
          return true;
        });
        setTotal(filtered.length);
        const from = (page - 1) * PAGE_SIZE;
        setData(filtered.slice(from, from + PAGE_SIZE).map((j) => ({ job: j, employer: j.employers ?? null })));
        setIsDemo(true);
      }
    } catch { setData([]); setTotal(0); setIsDemo(false); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, status, search]);

  const handleStatusChange = async (jobId: string, newStatus: 'DRAFT' | 'PUBLISHED' | 'CLOSED') => {
    setStatusError(null);
    const previousData = data;
    setData(previousData.map((r) => (r.job.id === jobId ? { ...r, job: { ...r.job, status: newStatus } } : r)));
    if (isDemo) return;
    const { error } = await updateJobStatus(jobId, newStatus);
    if (error) { setData(previousData); setStatusError('Status kon niet worden opgeslagen. Probeer opnieuw.'); return; }
    load();
  };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminPage>
      <AdminPageHeader icon={Briefcase} title="Opdrachten" description="Beheer alle vacatures en hun status" actions={
        <button type="button" onClick={() => exportToCsv('opdrachten', ['Titel', 'Bedrijf', 'Status', 'Aangemaakt'], data.map((r) => [r.job.title || '', r.job.company_name || r.employer?.company_name || '', r.job.status || '', new Date(r.job.created_at).toLocaleDateString('nl-NL')]))} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition" disabled={data.length === 0}>
          <Download className="w-4 h-4" /> Export CSV
        </button>
      } />
      {isDemo && <AdminAlert variant="warning">Demo-data wordt getoond. Status wijzigen wordt niet opgeslagen.</AdminAlert>}
      {statusError && <AdminAlert variant="error" onClose={() => setStatusError(null)}>{statusError}</AdminAlert>}

      <AdminFiltersBar>
        <JobsFilters status={status} search={search} onStatusChange={(v) => { setStatus(v); setPage(1); }} onSearchChange={(v) => { setSearch(v); setPage(1); }} />
      </AdminFiltersBar>

      {loading ? <AdminLoadingState /> : data.length === 0 ? (
        <AdminTableWrapper>
          <AdminEmptyState icon={Briefcase} title="Geen opdrachten gevonden" description="Pas filters aan of zoek op een andere term." />
        </AdminTableWrapper>
      ) : (
        <>
          <AdminTableWrapper>
            <JobsTable rows={data} onStatusChange={handleStatusChange} isDemo={isDemo} />
          </AdminTableWrapper>
          <AdminPagination page={page} totalPages={totalPages} from={from} to={to} total={total} onPageChange={setPage} />
        </>
      )}
    </AdminPage>
  );
}
