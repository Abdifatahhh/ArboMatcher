import { useState, useEffect } from 'react';
import { listUsers, toggleUserBlocked, deleteUserPermanently } from '../../services/adminUsersService';
import type { RoleFilter, StatusFilter } from '../../services/adminUsersService';
import { UsersFilters } from '../../components/Admin/UsersFilters';
import { UsersTable } from '../../components/Admin/UsersTable';
import type { Profile } from '../../lib/types';
import { demoProfiles } from '../../data/adminDemoData';
import { AdminPage, AdminPageHeader, AdminFiltersBar, AdminTableWrapper, AdminEmptyState, AdminLoadingState, AdminAlert, AdminPagination } from '../../components/Admin/adminUI';
import { Users, Trash2, Download } from 'lucide-react';
import { exportToCsv } from '../../lib/csvExport';
import { getRoleLabel } from '../../lib/roleLabels';

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
      const res = await listUsers({ role: role || undefined, status: status || undefined, search: search.trim() || undefined, page, pageSize: PAGE_SIZE });
      if (res.data.length > 0) { setData(res.data); setTotal(res.total); setIsDemo(false); }
      else {
        const term = search.trim().toLowerCase();
        const filtered = demoProfiles.filter((p) => {
          if (role && p.role !== role) return false;
          if (status && p.status !== status) return false;
          if (term) { const matchName = p.full_name?.toLowerCase().includes(term); const matchEmail = p.email?.toLowerCase().includes(term); if (!matchName && !matchEmail) return false; }
          return true;
        });
        setTotal(filtered.length);
        const from = (page - 1) * PAGE_SIZE;
        setData(filtered.slice(from, from + PAGE_SIZE));
        setIsDemo(true);
      }
    } catch { setData([]); setTotal(0); setIsDemo(false); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, role, status, search]);

  const handleToggleBlock = async (profileId: string) => { if (isDemo) return; const { error } = await toggleUserBlocked(profileId); if (!error) load(); };
  const handleToggleSelect = (id: string, checked: boolean) => { setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id))); };
  const handleSelectAll = (checked: boolean) => { setSelectedIds(checked ? data.map((p) => p.id) : []); };
  const handleDeleteOne = async (id: string) => {
    if (isDemo) return;
    if (!window.confirm('Deze gebruiker definitief verwijderen? Dit verwijdert het profiel en bijbehorende data uit de database.')) return;
    setDeleting(true);
    const { error } = await deleteUserPermanently(id);
    setDeleting(false);
    if (!error) { setSelectedIds((prev) => prev.filter((x) => x !== id)); load(); } else { alert(error); }
  };
  const handleDeleteSelected = async () => {
    if (isDemo || selectedIds.length === 0) return;
    if (!window.confirm(`${selectedIds.length} gebruiker(s) definitief verwijderen?`)) return;
    setDeleting(true);
    let failed = 0; let firstError: string | null = null;
    for (const id of selectedIds) { const { error } = await deleteUserPermanently(id); if (error) { failed += 1; if (!firstError) firstError = error; } }
    setDeleting(false); setSelectedIds([]); load();
    if (failed > 0) alert(firstError ? `${failed} mislukt: ${firstError}` : `${failed} verwijderen mislukt.`);
  };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminPage>
      <AdminPageHeader icon={Users} title="Gebruikers" description="Beheer alle gebruikers, rollen en status" actions={
        <button type="button" onClick={() => exportToCsv('gebruikers', ['Naam', 'E-mail', 'Rol', 'Status', 'Aangemaakt'], data.map((p) => [p.full_name || '', p.email || '', getRoleLabel(p.role), p.status || '', new Date(p.created_at).toLocaleDateString('nl-NL')]))} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition" disabled={data.length === 0}>
          <Download className="w-4 h-4" /> Export CSV
        </button>
      } />
      {isDemo && <AdminAlert variant="warning">Demo-data wordt getoond. Wijzigingen worden niet opgeslagen.</AdminAlert>}

      <AdminFiltersBar>
        <UsersFilters role={role} status={status} search={search} onRoleChange={(v) => { setRole(v); setPage(1); }} onStatusChange={(v) => { setStatus(v); setPage(1); }} onSearchChange={(v) => { setSearch(v); setPage(1); }} />
      </AdminFiltersBar>

      {selectedIds.length > 0 && (
        <div className="flex items-center gap-3">
          <button type="button" onClick={handleDeleteSelected} disabled={deleting || isDemo} className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition">
            <Trash2 className="w-4 h-4" /> Verwijder ({selectedIds.length})
          </button>
          <button type="button" onClick={() => setSelectedIds([])} className="text-sm text-slate-500 hover:text-slate-700">Selectie opheffen</button>
        </div>
      )}

      {loading ? <AdminLoadingState /> : data.length === 0 ? (
        <AdminTableWrapper>
          <AdminEmptyState icon={Users} title="Geen gebruikers gevonden" description="Pas filters aan of zoek op een andere term." />
        </AdminTableWrapper>
      ) : (
        <>
          <AdminTableWrapper>
            <UsersTable rows={data} selectedIds={selectedIds} onToggleBlock={handleToggleBlock} onToggleSelect={handleToggleSelect} onSelectAll={handleSelectAll} onDelete={handleDeleteOne} canDelete={!isDemo} />
          </AdminTableWrapper>
          <AdminPagination page={page} totalPages={totalPages} from={from} to={to} total={total} onPageChange={setPage} />
        </>
      )}
    </AdminPage>
  );
}
