import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { listDoctors } from '../../services/adminDoctorsService';
import type { AdminDoctorRow, VerificationFilter } from '../../services/adminDoctorsService';
import { checkBigNumber } from '../../services/bigCheckService';
import type { BigCheckResult } from '../../services/bigCheckService';
import { VerificatiesFilters } from '../../components/Admin/VerificatiesFilters';
import { VerificatiesTable } from '../../components/Admin/VerificatiesTable';
import { demoDoctorsList } from '../../data/adminDemoData';
import { CheckCircle, Shield, Info } from 'lucide-react';

const PAGE_SIZE = 20;

export default function AdminVerificaties() {
  const [data, setData] = useState<AdminDoctorRow[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);
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
      if (res.data.length > 0) {
        setData(res.data);
        setTotal(res.total);
        setIsDemo(false);
      } else {
        const term = search.trim().toLowerCase();
        const filtered = demoDoctorsList.filter((row) => {
          if (verification && row.doctor.verification_status !== verification) return false;
          if (term) {
            const matchName = row.profile.full_name?.toLowerCase().includes(term);
            const matchEmail = row.profile.email?.toLowerCase().includes(term);
            const matchBig = row.doctor.big_number?.toLowerCase().includes(term);
            if (!matchName && !matchEmail && !matchBig) return false;
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
  }, [page, verification, search]);

  const handleApprove = async (doctorId: string) => {
    if (isDemo) return;
    await supabase
      .from('doctors')
      .update({ verification_status: 'VERIFIED', verification_reason: null })
      .eq('id', doctorId);
    load();
  };

  const handleReject = async (doctorId: string) => {
    if (isDemo) return;
    const reason = window.prompt('Reden voor afwijzing (optioneel):');
    await supabase
      .from('doctors')
      .update({ verification_status: 'REJECTED', verification_reason: reason || null })
      .eq('id', doctorId);
    load();
  };

  const handleBigCheck = async (doctorId: string, bigNumber: string) => {
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
      {isDemo && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-3">
          <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <p className="text-amber-900 text-sm">Demo-data wordt getoond. BIG check werkt ook bij demo. Goedkeuren/afwijzen wordt niet opgeslagen.</p>
        </div>
      )}
      <h1 className="text-3xl font-bold text-[#0F172A] mb-6 flex items-center gap-2">
        <Shield className="w-8 h-8" />
        BIG Verificaties
      </h1>

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

      {loading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F172A]" />
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow-lg text-center">
          <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Geen verificaties</h3>
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
