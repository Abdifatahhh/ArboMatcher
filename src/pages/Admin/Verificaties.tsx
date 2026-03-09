import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { listDoctors } from '../../services/adminDoctorsService';
import type { AdminDoctorRow, VerificationFilter } from '../../services/adminDoctorsService';
import { checkBigNumber } from '../../services/bigCheckService';
import type { BigCheckResult } from '../../services/bigCheckService';
import { VerificatiesFilters } from '../../components/Admin/VerificatiesFilters';
import { VerificatiesTable } from '../../components/Admin/VerificatiesTable';
import { CheckCircle, Shield } from 'lucide-react';

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
      const res = await listDoctors({
        verification: verification || undefined,
        status: undefined,
        search: search.trim() || undefined,
        page,
        pageSize: PAGE_SIZE,
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
  }, [page, verification, search]);

  const handleApprove = async (doctorId: string) => {
    await supabase
      .from('professionals')
      .update({ verification_status: 'VERIFIED', verification_reason: null })
      .eq('id', doctorId);
    load();
  };

  const handleReject = async (doctorId: string) => {
    const reason = window.prompt('Reden voor afwijzing (optioneel):');
    await supabase
      .from('professionals')
      .update({ verification_status: 'REJECTED', verification_reason: reason || null })
      .eq('id', doctorId);
    load();
  };

  const handleBigCheck = async (doctorId: string, bigNumber: string) => {
    const digits = (bigNumber ?? '').replace(/\D/g, '');
    if (digits.length !== 11) {
      setBigCheckDoctorId(doctorId);
      setBigCheckResult({ formatValid: false, registerChecked: false, found: false, message: 'BIG-nummer bestaat uit 11 cijfers.' });
      setCheckingBigId(null);
      return;
    }
    setCheckingBigId(doctorId);
    setBigCheckResult(null);
    setBigCheckDoctorId(doctorId);
    const result = await checkBigNumber(bigNumber);
    setBigCheckResult(result);
    setCheckingBigId(null);
  };

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#0F172A] mb-2 flex items-center gap-2">
        <Shield className="w-8 h-8 text-[#4FA151]" />
        BIG Verificaties
      </h1>
      <p className="text-emerald-700/80 text-sm mb-6">Beoordeel en verifieer BIG-registraties van artsen</p>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-emerald-100 shadow-md p-4 mb-6">
        <VerificatiesFilters
          verification={verification}
          search={search}
          onVerificationChange={(v) => {
            setVerification(v);
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
          <CheckCircle className="w-16 h-16 text-emerald-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Geen verificaties</h3>
          <p className="text-gray-500">Pas filters aan of zoek op een andere term.</p>
        </div>
      ) : (
        <>
          <VerificatiesTable
            rows={data}
            onApprove={handleApprove}
            onReject={handleReject}
            onBigCheck={handleBigCheck}
            checkingBigId={checkingBigId}
            bigCheckResult={bigCheckResult}
            bigCheckDoctorId={bigCheckDoctorId}
            onCloseBigCheck={() => {
              setBigCheckDoctorId(null);
              setBigCheckResult(null);
            }}
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
