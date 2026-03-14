import { useState, useEffect } from 'react';
import { listClients, toggleClientBlocked } from '../../services/adminClientsService';
import { ClientsFilters } from '../../components/Admin/ClientsFilters';
import type { StatusFilter } from '../../components/Admin/ClientsFilters';
import { ClientsTable } from '../../components/Admin/ClientsTable';
import type { AdminClientRow } from '../../services/adminClientsService';
import { demoOpdrachtgevers } from '../../data/adminDemoData';
import { AdminPage, AdminPageHeader, AdminFiltersBar, AdminTableWrapper, AdminEmptyState, AdminLoadingState, AdminAlert, AdminPagination } from '../../components/Admin/adminUI';
import { Building2 } from 'lucide-react';

const PAGE_SIZE = 20;

export default function AdminOpdrachtgevers() {
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
      const res = await listClients({ status: status || undefined, search: search.trim() || undefined, page, pageSize: PAGE_SIZE });
      if (res.data.length > 0) { setData(res.data); setTotal(res.total); setIsDemo(false); }
      else {
        const filtered = demoOpdrachtgevers.filter((row) => {
          if (status && row.profile.status !== status) return false;
          if (search.trim()) { const term = search.trim().toLowerCase(); if (!row.employer.company_name?.toLowerCase().includes(term) && !row.profile.email?.toLowerCase().includes(term)) return false; }
          return true;
        });
        setTotal(filtered.length);
        const from = (page - 1) * PAGE_SIZE;
        setData(filtered.slice(from, from + PAGE_SIZE));
        setIsDemo(true);
      }
    } catch { setData([]); setTotal(0); setIsDemo(false); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, status, search]);

  const handleToggleBlock = async (employerId: string) => { if (isDemo) return; const { error } = await toggleClientBlocked(employerId); if (!error) load(); };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminPage>
      <AdminPageHeader icon={Building2} title="Organisaties" description="Beheer organisaties en hun bedrijfsgegevens" />
      {isDemo && <AdminAlert variant="warning">Demo-data wordt getoond. Wijzigingen worden niet opgeslagen.</AdminAlert>}

      <AdminFiltersBar>
        <ClientsFilters status={status} search={search} onStatusChange={(v) => { setStatus(v); setPage(1); }} onSearchChange={(v) => { setSearch(v); setPage(1); }} />
      </AdminFiltersBar>

      {loading ? <AdminLoadingState /> : data.length === 0 ? (
        <AdminTableWrapper>
          <AdminEmptyState icon={Building2} title="Geen organisaties gevonden" description="Pas filters aan of zoek op een andere term." />
        </AdminTableWrapper>
      ) : (
        <>
          <AdminTableWrapper>
            <ClientsTable rows={data} onToggleBlock={handleToggleBlock} />
          </AdminTableWrapper>
          <AdminPagination page={page} totalPages={totalPages} from={from} to={to} total={total} onPageChange={setPage} />
        </>
      )}
    </AdminPage>
  );
}
