import { useState, useEffect } from 'react';
import { listUsers, toggleUserBlocked, deleteUserPermanently } from '../../services/adminUsersService';
import type { RoleFilter, StatusFilter } from '../../services/adminUsersService';
import { UsersFilters } from '../../components/Admin/UsersFilters';
import { UsersTable } from '../../components/Admin/UsersTable';
import type { Profile } from '../../lib/types';
import { demoProfiles } from '../../data/adminDemoData';
import { Users, Info, Trash2 } from 'lucide-react';

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState(false);

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

  const handleToggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedIds(checked ? data.map((p) => p.id) : []);
  };

  const handleDeleteOne = async (id: string) => {
    if (isDemo) return;
    if (!window.confirm('Deze gebruiker definitief verwijderen? Dit verwijdert het profiel en bijbehorende data uit de database.')) return;
    setDeleting(true);
    const { error } = await deleteUserPermanently(id);
    setDeleting(false);
    if (!error) {
      setSelectedIds((prev) => prev.filter((x) => x !== id));
      load();
    } else {
      alert(error);
    }
  };

  const handleDeleteSelected = async () => {
    if (isDemo || selectedIds.length === 0) return;
    if (!window.confirm(`${selectedIds.length} gebruiker(s) definitief verwijderen? Dit verwijdert ze uit de database.`)) return;
    setDeleting(true);
    let failed = 0;
    let firstError: string | null = null;
    for (const id of selectedIds) {
      const { error } = await deleteUserPermanently(id);
      if (error) {
        failed += 1;
        if (!firstError) firstError = error;
      }
    }
    setDeleting(false);
    setSelectedIds([]);
    load();
    if (failed > 0) {
      alert(firstError ? `${failed} van ${selectedIds.length} mislukt: ${firstError}` : `${failed} van ${selectedIds.length} verwijderen mislukt.`);
    }
  };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-6">
      {isDemo && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 shadow-sm">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-900 text-sm">Demo-data wordt getoond. Doorklikken toont de demo-detailpagina. Wijzigingen worden niet opgeslagen.</p>
        </div>
      )}
      <h1 className="text-3xl font-bold text-[#0F172A] mb-2 flex items-center gap-2">
        <Users className="w-8 h-8 text-[#4FA151]" />
        Gebruikers
      </h1>
      <p className="text-emerald-700/80 text-sm mb-6">Beheer alle gebruikers, rollen en status</p>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100 shadow-md p-4 mb-6">
        <UsersFilters role={role} status={status} search={search} onRoleChange={(v) => { setRole(v); setPage(1); }} onStatusChange={(v) => { setStatus(v); setPage(1); }} onSearchChange={(v) => { setSearch(v); setPage(1); }} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16 rounded-xl bg-white/60 border border-emerald-100">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-200 border-t-[#4FA151]" />
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-emerald-100 shadow-md text-center">
          <Users className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Geen gebruikers gevonden</h3>
          <p className="text-gray-500">Pas filters aan of zoek op een andere term.</p>
        </div>
      ) : (
        <>
          {selectedIds.length > 0 && (
            <div className="mb-4 flex items-center gap-3">
              <button
                type="button"
                onClick={handleDeleteSelected}
                disabled={deleting || isDemo}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4" />
                Verwijder geselecteerde ({selectedIds.length})
              </button>
              <button type="button" onClick={() => setSelectedIds([])} className="text-sm text-gray-600 hover:underline">
                Selectie opheffen
              </button>
            </div>
          )}
          <UsersTable
            rows={data}
            selectedIds={selectedIds}
            onToggleBlock={handleToggleBlock}
            onToggleSelect={handleToggleSelect}
            onSelectAll={handleSelectAll}
            onDelete={handleDeleteOne}
            canDelete={!isDemo}
          />
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
