import { useState, useEffect } from 'react';
import { listClients, toggleClientBlocked } from '../../services/adminClientsService';
import { ClientsFilters } from '../../components/Admin/ClientsFilters';
import type { StatusFilter } from '../../components/Admin/ClientsFilters';
import { ClientsTable } from '../../components/Admin/ClientsTable';
import type { AdminClientRow } from '../../services/adminClientsService';
import { demoOpdrachtgevers } from '../../data/adminDemoData';
import { Building2, Info } from 'lucide-react';

const PAGE_SIZE = 20;

export default function AdminOrganisaties() {
  const [data, setData] = useState<AdminClientRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [status, setStatus] = useState<StatusFilter>('');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await listClients({
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
        const filtered = demoOpdrachtgevers.filter((row) => {
          if (status && row.profile.status !== status) return false;
          if (search.trim()) {
            const term = search.trim().toLowerCase();
            const matchName = row.employer.company_name?.toLowerCase().includes(term);
            const matchEmail = row.profile.email?.toLowerCase().includes(term);
            if (!matchName && !matchEmail) return false;
          }
          return true;
        });
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
  }, [page, status, search]);

  const handleToggleBlock = async (employerId: string) => {
    if (isDemo) return;
    const { error } = await toggleClientBlocked(employerId);
    if (!error) load();
  };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-6">
      {isDemo && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 shadow-sm">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-900 text-sm">Demo-organisaties worden getoond. Doorklikken toont de demo-detailpagina. Wijzigingen worden niet opgeslagen.</p>
        </div>
      )}
      <h1 className="text-3xl font-bold text-[#0F172A] mb-2 flex items-center gap-2">
        <Building2 className="w-8 h-8 text-[#4FA151]" />
        Organisaties
      </h1>
      <p className="text-emerald-700/80 text-sm mb-6">Beheer organisaties</p>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100 shadow-md p-4 mb-6">
        <ClientsFilters
          status={status}
          search={search}
          onStatusChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
          onSearchChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16 rounded-xl bg-white/60 border border-emerald-100">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-200 border-t-[#4FA151]" />
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-emerald-100 shadow-md text-center">
          <Building2 className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Geen organisaties gevonden</h3>
          <p className="text-gray-500">Pas filters aan of zoek op een andere term.</p>
        </div>
      ) : (
        <>
          <ClientsTable rows={data} onToggleBlock={handleToggleBlock} />
          <div className="mt-4 flex items-center justify-between px-1">
            <p className="text-sm text-emerald-800/80 font-medium">
              {from}–{to} van {total}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-800 bg-white hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Vorige
              </button>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="px-4 py-2 border border-emerald-200 rounded-xl text-sm font-medium text-emerald-800 bg-white hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
