import { useState, useEffect } from 'react';
import { listApplications, updateApplicationStatus } from '../../services/adminApplicationsService';
import type { ApplicationStatusFilter } from '../../services/adminApplicationsService';
import { ApplicationsFilters } from '../../components/Admin/ApplicationsFilters';
import { ApplicationsTable } from '../../components/Admin/ApplicationsTable';
import type { AdminApplicationRow } from '../../services/adminApplicationsService';
import { demoApplications } from '../../data/adminDemoData';
import { FileText, Info } from 'lucide-react';

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
      const res = await listApplications({
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
        const filtered = demoApplications.filter((a) => {
          if (status && a.status !== status) return false;
          if (term) {
            const jobTitle = a.jobs?.title?.toLowerCase() ?? '';
            const docName = (a.doctors as { profiles: { full_name?: string; email?: string } | null } | null)?.profiles?.full_name?.toLowerCase() ?? '';
            const docEmail = (a.doctors as { profiles: { email?: string } | null } | null)?.profiles?.email?.toLowerCase() ?? '';
            if (!jobTitle.includes(term) && !docName.includes(term) && !docEmail.includes(term)) return false;
          }
          return true;
        });
        setTotal(filtered.length);
        const from = (page - 1) * PAGE_SIZE;
        setData(
          filtered.slice(from, from + PAGE_SIZE).map((a) => ({
            application: a,
            job: a.jobs ?? null,
            doctor: a.doctors ?? null,
            profile: (a.doctors as { profiles: import('../../lib/types').Profile | null } | null)?.profiles ?? null,
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

  const handleStatusChange = async (applicationId: string, newStatus: 'PENDING' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED') => {
    setStatusError(null);
    const previousData = data;
    setData(previousData.map((r) => (r.application.id === applicationId ? { ...r, application: { ...r.application, status: newStatus } } : r)));
    if (isDemo) return;
    const { error } = await updateApplicationStatus(applicationId, newStatus);
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
        <FileText className="w-8 h-8 text-[#4FA151]" />
        Sollicitaties / Reacties
      </h1>
      <p className="text-emerald-700/80 text-sm mb-6">Overzicht van alle sollicitaties op opdrachten</p>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100 shadow-md p-4 mb-6">
        <ApplicationsFilters status={status} search={search} onStatusChange={(v) => { setStatus(v); setPage(1); }} onSearchChange={(v) => { setSearch(v); setPage(1); }} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16 rounded-xl bg-white/60 border border-emerald-100">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-200 border-t-[#4FA151]" />
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-emerald-100 shadow-md text-center">
          <FileText className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Geen sollicitaties gevonden</h3>
          <p className="text-gray-500">Pas filters aan of zoek op een andere term.</p>
        </div>
      ) : (
        <>
          <ApplicationsTable rows={data} onStatusChange={handleStatusChange} isDemo={isDemo} />
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
