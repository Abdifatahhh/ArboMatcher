import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { listDoctors, toggleDoctorBlocked } from '../../services/adminDoctorsService';
import type { AdminDoctorRow, VerificationFilter, StatusFilter } from '../../services/adminDoctorsService';
import { DoctorsFilters } from '../../components/Admin/DoctorsFilters';
import { DoctorsTable } from '../../components/Admin/DoctorsTable';
import { Stethoscope } from 'lucide-react';

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
      const res = await listDoctors({
        verification: verification || undefined,
        status: status || undefined,
        search: search.trim() || undefined,
        page,
        pageSize: PAGE_SIZE,
        excludeUserId: user?.id ?? undefined,
      });
      setData(res.data);
      setTotal(res.total);
    } catch {
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, verification, status, search, user?.id]);

  const handleToggleBlock = async (doctorId: string) => {
    const { error } = await toggleDoctorBlocked(doctorId);
    if (!error) load();
  };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-2 flex items-center gap-2">
        <Stethoscope className="w-8 h-8 text-[#4FA151]" />
        Professionals
      </h1>
      <p className="text-emerald-700/80 text-sm mb-6">Overzicht van alle geregistreerde professionals en hun verificatiestatus</p>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100 shadow-md p-4 mb-6">
        <DoctorsFilters verification={verification} status={status} search={search} onVerificationChange={(v) => { setVerification(v); setPage(1); }} onStatusChange={(v) => { setStatus(v); setPage(1); }} onSearchChange={(v) => { setSearch(v); setPage(1); }} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16 rounded-xl bg-white/60 border border-emerald-100">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-200 border-t-[#4FA151]" />
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white p-12 rounded-xl border border-emerald-100 shadow-md text-center">
          <Stethoscope className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Geen professionals gevonden</h3>
          <p className="text-gray-500">Pas filters aan of zoek op een andere term.</p>
        </div>
      ) : (
        <>
          <DoctorsTable rows={data} onToggleBlock={handleToggleBlock} />
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
