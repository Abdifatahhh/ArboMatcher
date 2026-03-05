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
    if (isDemo) return;
    const { error } = await updateApplicationStatus(applicationId, newStatus);
    if (!error) load();
  };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-6">
      {isDemo && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-900 text-sm">Demo-data wordt getoond. Status wijzigen wordt niet opgeslagen.</p>
        </div>
      )}
      <h1 className="text-3xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
        <FileText className="w-8 h-8" />
        Sollicitaties / Reacties
      </h1>

      <ApplicationsFilters
        status={status}
        search={search}
        onStatusChange={(v) => { setStatus(v); setPage(1); }}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
      />

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]" />
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-lg text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Geen sollicitaties gevonden</h3>
          <p className="text-gray-500">Pas filters aan of zoek op een andere term.</p>
        </div>
      ) : (
        <>
          <ApplicationsTable rows={data} onStatusChange={handleStatusChange} isDemo={isDemo} />
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {from}–{to} van {total}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Vorige
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Volgende
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
