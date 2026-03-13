import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { listDoctors, toggleDoctorBlocked } from '../../services/adminDoctorsService';
import type { AdminDoctorRow, VerificationFilter, StatusFilter } from '../../services/adminDoctorsService';
import { DoctorsFilters } from '../../components/Admin/DoctorsFilters';
import { DoctorsTable } from '../../components/Admin/DoctorsTable';
import { AdminPage, AdminPageHeader, AdminFiltersBar, AdminTableWrapper, AdminEmptyState, AdminLoadingState, AdminPagination } from '../../components/Admin/adminUI';
import { Stethoscope, Download } from 'lucide-react';
import { exportToCsv } from '../../lib/csvExport';

const PAGE_SIZE = 20;

export default function AdminArtsen() {
  const { user } = useAuth();
  const [data, setData] = useState<AdminDoctorRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState<VerificationFilter>('');
  const [status, setStatus] = useState<StatusFilter>('');
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const res = await listDoctors({ verification: verification || undefined, status: status || undefined, search: search.trim() || undefined, page, pageSize: PAGE_SIZE, excludeUserId: user?.id ?? undefined });
      setData(res.data); setTotal(res.total);
    } catch { setData([]); setTotal(0); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, verification, status, search, user?.id]);

  const handleToggleBlock = async (doctorId: string) => { const { error } = await toggleDoctorBlocked(doctorId); if (!error) load(); };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminPage>
      <AdminPageHeader icon={Stethoscope} title="Professionals" description="Overzicht van alle geregistreerde professionals en hun verificatiestatus" actions={
        <button type="button" onClick={() => exportToCsv('professionals', ['Naam', 'E-mail', 'BIG', 'Verificatie', 'Status', 'Aangemaakt'], data.map((r) => [r.profile?.full_name || '', r.profile?.email || '', r.doctor.big_number || '', r.doctor.verification_status || '', r.profile?.status || '', new Date(r.doctor.created_at).toLocaleDateString('nl-NL')]))} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition" disabled={data.length === 0}>
          <Download className="w-4 h-4" /> Export CSV
        </button>
      } />

      <AdminFiltersBar>
        <DoctorsFilters verification={verification} status={status} search={search} onVerificationChange={(v) => { setVerification(v); setPage(1); }} onStatusChange={(v) => { setStatus(v); setPage(1); }} onSearchChange={(v) => { setSearch(v); setPage(1); }} />
      </AdminFiltersBar>

      {loading ? <AdminLoadingState /> : data.length === 0 ? (
        <AdminTableWrapper>
          <AdminEmptyState icon={Stethoscope} title="Geen professionals gevonden" description="Pas filters aan of zoek op een andere term." />
        </AdminTableWrapper>
      ) : (
        <>
          <AdminTableWrapper>
            <DoctorsTable rows={data} onToggleBlock={handleToggleBlock} />
          </AdminTableWrapper>
          <AdminPagination page={page} totalPages={totalPages} from={from} to={to} total={total} onPageChange={setPage} />
        </>
      )}
    </AdminPage>
  );
}
