import { useState, useEffect } from 'react';
import { listJobs, updateJobStatus } from '../../services/adminJobsService';
import type { JobStatusFilter } from '../../services/adminJobsService';
import { JobsFilters } from '../../components/Admin/JobsFilters';
import { JobsTable } from '../../components/Admin/JobsTable';
import type { AdminJobRow } from '../../services/adminJobsService';
import { demoJobs } from '../../data/adminDemoData';
import { Briefcase, Info } from 'lucide-react';

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
      const res = await listJobs({
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
        const filtered = demoJobs.filter((j) => {
          if (status && j.status !== status) return false;
          if (term) {
            const matchTitle = j.title?.toLowerCase().includes(term);
            const matchCompany = (j.company_name ?? j.employers?.company_name)?.toLowerCase().includes(term);
            if (!matchTitle && !matchCompany) return false;
          }
          return true;
        });
        setTotal(filtered.length);
        const from = (page - 1) * PAGE_SIZE;
        setData(
          filtered.slice(from, from + PAGE_SIZE).map((j) => ({
            job: j,
            employer: j.employers ?? null,
          }))
        );
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
  }, [page, status, search]);

  const handleStatusChange = async (jobId: string, newStatus: 'DRAFT' | 'PUBLISHED' | 'CLOSED') => {
    setStatusError(null);
    const previousData = data;
    setData(previousData.map((r) => (r.job.id === jobId ? { ...r, job: { ...r.job, status: newStatus } } : r)));
    if (isDemo) return;
    const { error } = await updateJobStatus(jobId, newStatus);
    if (error) {
      setData(previousData);
      setStatusError('Status kon niet worden opgeslagen. Probeer opnieuw.');
      return;
    }
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
          <p className="text-amber-900 text-sm">Demo-data wordt getoond. Status wijzigen wordt niet opgeslagen.</p>
        </div>
      )}
      {statusError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 shadow-sm">
          <Info className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-red-900 text-sm">{statusError}</p>
          <button type="button" onClick={() => setStatusError(null)} className="ml-auto text-red-700 hover:underline text-sm">Sluiten</button>
        </div>
      )}
      <h1 className="text-3xl font-bold text-[#0F172A] mb-2 flex items-center gap-2">
        <Briefcase className="w-8 h-8 text-[#4FA151]" />
        Opdrachten
      </h1>
      <p className="text-emerald-700/80 text-sm mb-6">Beheer alle vacatures en hun status</p>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100 shadow-md p-4 mb-6">
        <JobsFilters status={status} search={search} onStatusChange={(v) => { setStatus(v); setPage(1); }} onSearchChange={(v) => { setSearch(v); setPage(1); }} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16 rounded-xl bg-white/60 border border-emerald-100">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-200 border-t-[#4FA151]" />
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-emerald-100 shadow-md text-center">
          <Briefcase className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Geen opdrachten gevonden</h3>
          <p className="text-gray-500">Pas filters aan of zoek op een andere term.</p>
        </div>
      ) : (
        <>
          <JobsTable rows={data} onStatusChange={handleStatusChange} isDemo={isDemo} />
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
