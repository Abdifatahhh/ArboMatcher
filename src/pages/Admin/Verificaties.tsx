import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { listDoctors } from '../../services/adminDoctorsService';
import type { AdminDoctorRow, VerificationFilter } from '../../services/adminDoctorsService';
import { checkBigNumber } from '../../services/bigCheckService';
import type { BigCheckResult } from '../../services/bigCheckService';
import { VerificatiesFilters } from '../../components/Admin/VerificatiesFilters';
import { VerificatiesTable } from '../../components/Admin/VerificatiesTable';
import { AdminPage, AdminPageHeader, AdminFiltersBar, AdminTableWrapper, AdminEmptyState, AdminLoadingState, AdminPagination } from '../../components/Admin/adminUI';
import { Shield, CheckCircle } from 'lucide-react';

const PAGE_SIZE = 20;

export default function AdminVerificaties() {
  const [data, setData] = useState<AdminDoctorRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [verification, setVerification] = useState<VerificationFilter>('PENDING');
  const [search, setSearch] = useState('');
  const [checkingBigId, setCheckingBigId] = useState<string | null>(null);
  const [bigCheckResult, setBigCheckResult] = useState<BigCheckResult | null>(null);
  const [bigCheckDoctorId, setBigCheckDoctorId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await listDoctors({ verification: verification || undefined, status: undefined, search: search.trim() || undefined, page, pageSize: PAGE_SIZE });
      setData(res.data); setTotal(res.total);
    } catch { setData([]); setTotal(0); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, verification, search]);

  const handleApprove = async (doctorId: string) => {
    await supabase.from('professionals').update({ verification_status: 'VERIFIED', verification_reason: null }).eq('id', doctorId);
    load();
  };

  const handleReject = async (doctorId: string) => {
    const reason = window.prompt('Reden voor afwijzing (optioneel):');
    await supabase.from('professionals').update({ verification_status: 'REJECTED', verification_reason: reason || null }).eq('id', doctorId);
    load();
  };

  const handleBigCheck = async (doctorId: string, bigNumber: string) => {
    const digits = (bigNumber ?? '').replace(/\D/g, '');
    if (digits.length !== 11) {
      setBigCheckDoctorId(doctorId);
      setBigCheckResult({ formatValid: false, registerChecked: false, found: false, message: 'BIG-register bestaat uit 11 cijfers.' });
      setCheckingBigId(null);
      return;
    }
    setCheckingBigId(doctorId); setBigCheckResult(null); setBigCheckDoctorId(doctorId);
    const result = await checkBigNumber(bigNumber);
    setBigCheckResult(result); setCheckingBigId(null);
  };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <AdminPage>
      <AdminPageHeader icon={Shield} title="BIG Verificaties" description="Beoordeel en verifieer BIG-registraties van professionals" />

      <AdminFiltersBar>
        <VerificatiesFilters verification={verification} search={search} onVerificationChange={(v) => { setVerification(v); setPage(1); }} onSearchChange={(v) => { setSearch(v); setPage(1); }} />
      </AdminFiltersBar>

      {loading ? <AdminLoadingState /> : data.length === 0 ? (
        <AdminTableWrapper>
          <AdminEmptyState icon={CheckCircle} title="Geen verificaties" description="Pas filters aan of zoek op een andere term." />
        </AdminTableWrapper>
      ) : (
        <>
          <AdminTableWrapper>
            <VerificatiesTable rows={data} onApprove={handleApprove} onReject={handleReject} onBigCheck={handleBigCheck} checkingBigId={checkingBigId} bigCheckResult={bigCheckResult} bigCheckDoctorId={bigCheckDoctorId} onCloseBigCheck={() => { setBigCheckDoctorId(null); setBigCheckResult(null); }} />
          </AdminTableWrapper>
          <AdminPagination page={page} totalPages={totalPages} from={from} to={to} total={total} onPageChange={setPage} />
        </>
      )}
    </AdminPage>
  );
}
