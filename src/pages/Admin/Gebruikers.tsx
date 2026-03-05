import { useState, useEffect } from 'react';
import { listUsers, toggleUserBlocked } from '../../services/adminUsersService';
import type { RoleFilter, StatusFilter } from '../../services/adminUsersService';
import { UsersFilters } from '../../components/Admin/UsersFilters';
import { UsersTable } from '../../components/Admin/UsersTable';
import type { Profile } from '../../lib/types';
import { demoProfiles } from '../../data/adminDemoData';
import { Users, Info } from 'lucide-react';

const PAGE_SIZE = 20;

export default function AdminGebruikers() {
  const [data, setData] = useState<Profile[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
  const [role, setRole] = useState<RoleFilter>('');
  const [status, setStatus] = useState<StatusFilter>('');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await listUsers({
        role: role || undefined,
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
        const filtered = demoProfiles.filter((p) => {
          if (role && p.role !== role) return false;
          if (status && p.status !== status) return false;
          if (term) {
            const matchName = p.full_name?.toLowerCase().includes(term);
            const matchEmail = p.email?.toLowerCase().includes(term);
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
  }, [page, role, status, search]);

  const handleToggleBlock = async (profileId: string) => {
    if (isDemo) return;
    const { error } = await toggleUserBlocked(profileId);
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
          <p className="text-amber-900 text-sm">Demo-data wordt getoond. Doorklikken toont de demo-detailpagina. Wijzigingen worden niet opgeslagen.</p>
        </div>
      )}
      <h1 className="text-3xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
        <Users className="w-8 h-8" />
        Gebruikers
      </h1>

      <UsersFilters
        role={role}
        status={status}
        search={search}
        onRoleChange={(v) => { setRole(v); setPage(1); }}
        onStatusChange={(v) => { setStatus(v); setPage(1); }}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
      />

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]" />
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-lg text-center">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Geen gebruikers gevonden</h3>
          <p className="text-gray-500">Pas filters aan of zoek op een andere term.</p>
        </div>
      ) : (
        <>
          <UsersTable rows={data} onToggleBlock={handleToggleBlock} />
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
