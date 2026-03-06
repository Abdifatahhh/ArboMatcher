import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import type { AdminDoctorRow } from '../../services/adminDoctorsService';
import type { BigCheckResult } from '../../services/bigCheckService';
import { CheckCircle, XCircle, Shield, Search, Loader2 } from 'lucide-react';

const VERIFICATION_LABELS: Record<string, string> = {
  VERIFIED: 'Geverifieerd',
  PENDING: 'Wachtend',
  REJECTED: 'Afgewezen',
  UNVERIFIED: 'Niet geverifieerd',
};

interface VerificatiesTableProps {
  rows: AdminDoctorRow[];
  onApprove: (doctorId: string) => void;
  onReject: (doctorId: string) => void;
  onBigCheck: (doctorId: string, bigNumber: string) => void;
  checkingBigId: string | null;
  bigCheckResult: BigCheckResult | null;
  bigCheckDoctorId: string | null;
  onCloseBigCheck: () => void;
}

export function VerificatiesTable({
  rows,
  onApprove,
  onReject,
  onBigCheck,
  checkingBigId,
  bigCheckResult,
  bigCheckDoctorId,
  onCloseBigCheck,
}: VerificatiesTableProps) {
  return (
    <>
      <div className="rounded-xl border border-emerald-100 overflow-hidden shadow-md bg-white">
        <table className="min-w-full">
          <thead>
            <tr className="bg-[#4FA151] border-b border-[#3E8E45]">
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Naam</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Email</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">BIG-nummer</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Status</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-white uppercase tracking-wider">Datum</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold text-white uppercase tracking-wider">Acties</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50">
            {rows.map(({ doctor, profile }, idx) => {
              const isPending = doctor.verification_status === 'PENDING';
              const isChecking = checkingBigId === doctor.id;
              const showResult = bigCheckDoctorId === doctor.id && bigCheckResult;
              const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-emerald-50/30';
              return (
                <Fragment key={doctor.id}>
                  <tr className={`${rowBg} hover:bg-emerald-50/50 transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/admin/artsen/${doctor.id}`} className="text-sm font-semibold text-[#0F172A] hover:text-[#4FA151] hover:underline transition">
                        {profile.full_name || '—'}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{profile.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-mono">{doctor.big_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-lg border ${
                        doctor.verification_status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                        doctor.verification_status === 'PENDING' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        doctor.verification_status === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-200' :
                        'bg-gray-100 text-gray-800 border-gray-200'
                      }`}>
                        {VERIFICATION_LABELS[doctor.verification_status] ?? doctor.verification_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(profile.created_at).toLocaleDateString('nl-NL')}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2 flex-wrap">
                        <Link to={`/admin/artsen/${doctor.id}`} className="inline-flex items-center gap-1 text-sm text-[#4FA151] hover:underline font-medium">Bekijken</Link>
                        <button type="button" onClick={() => onBigCheck(doctor.id, doctor.big_number)} disabled={isChecking} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm text-emerald-800 bg-emerald-50 hover:bg-emerald-100 disabled:opacity-50 transition" title="BIG direct controleren">
                          {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                          BIG check
                        </button>
                        {isPending && (
                          <>
                            <button type="button" onClick={() => onApprove(doctor.id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm text-green-700 bg-green-50 hover:bg-green-100 transition">
                              <CheckCircle className="w-4 h-4" /> Goedkeuren
                            </button>
                            <button type="button" onClick={() => onReject(doctor.id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm text-red-700 bg-red-50 hover:bg-red-100 transition">
                              <XCircle className="w-4 h-4" /> Afwijzen
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                  {showResult && bigCheckResult ? (
                    <tr key={`${doctor.id}-result`} className="bg-emerald-50/50">
                      <td colSpan={6} className="px-6 py-3 text-sm border-l-4 border-emerald-200">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-emerald-700 flex-shrink-0" />
                            <span className={bigCheckResult.found ? 'text-emerald-800' : bigCheckResult.formatValid ? 'text-amber-700' : 'text-red-700'}>
                              {bigCheckResult.message}
                              {bigCheckResult.name && <span className="block text-gray-600 mt-0.5">Naam in register: {bigCheckResult.name}</span>}
                              {bigCheckResult.error && <span className="block text-gray-500 mt-0.5 text-xs">Detail: {bigCheckResult.error}</span>}
                            </span>
                          </div>
                          <button type="button" onClick={onCloseBigCheck} className="text-emerald-700 hover:text-emerald-900 text-xs font-medium">Sluiten</button>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
