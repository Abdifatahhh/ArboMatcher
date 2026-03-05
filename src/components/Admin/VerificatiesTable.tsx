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
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Naam</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">BIG-nummer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Datum</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acties</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {rows.map(({ doctor, profile }) => {
              const isPending = doctor.verification_status === 'PENDING';
              const isChecking = checkingBigId === doctor.id;
              const showResult = bigCheckDoctorId === doctor.id && bigCheckResult;
              return (
                <Fragment key={doctor.id}>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={`/admin/artsen/${doctor.id}`}
                      className="text-sm font-medium text-[#0F172A] hover:text-[#4FA151] hover:underline"
                    >
                      {profile.full_name || '—'}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{profile.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{doctor.big_number}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded ${
                        doctor.verification_status === 'VERIFIED'
                          ? 'bg-green-100 text-green-800'
                          : doctor.verification_status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : doctor.verification_status === 'REJECTED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {VERIFICATION_LABELS[doctor.verification_status] ?? doctor.verification_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(profile.created_at).toLocaleDateString('nl-NL')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 flex-wrap">
                      <Link
                        to={`/admin/artsen/${doctor.id}`}
                        className="inline-flex items-center gap-1 text-sm text-[#4FA151] hover:underline"
                      >
                        Bekijken
                      </Link>
                      <button
                        type="button"
                        onClick={() => onBigCheck(doctor.id, doctor.big_number)}
                        disabled={isChecking}
                        className="inline-flex items-center gap-1 text-sm text-gray-600 hover:underline disabled:opacity-50"
                        title="BIG direct controleren"
                      >
                        {isChecking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                        BIG check
                      </button>
                      {isPending && (
                        <>
                          <button
                            type="button"
                            onClick={() => onApprove(doctor.id)}
                            className="inline-flex items-center gap-1 text-sm text-green-600 hover:underline"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Goedkeuren
                          </button>
                          <button
                            type="button"
                            onClick={() => onReject(doctor.id)}
                            className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline"
                          >
                            <XCircle className="w-4 h-4" />
                            Afwijzen
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                {showResult && bigCheckResult ? (
                  <tr key={`${doctor.id}-result`} className="bg-gray-50">
                    <td colSpan={6} className="px-6 py-3 text-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <Shield className="w-5 h-5 text-[#0F172A] flex-shrink-0" />
                          <span className={bigCheckResult.found ? 'text-green-700' : bigCheckResult.formatValid ? 'text-amber-700' : 'text-red-700'}>
                            {bigCheckResult.message}
                            {bigCheckResult.name && (
                              <span className="block text-gray-600 mt-0.5">Naam in register: {bigCheckResult.name}</span>
                            )}
                            {bigCheckResult.error && (
                              <span className="block text-gray-500 mt-0.5 text-xs">Detail: {bigCheckResult.error}</span>
                            )}
                          </span>
                        </div>
                        <button type="button" onClick={onCloseBigCheck} className="text-gray-500 hover:text-gray-700 text-xs">
                          Sluiten
                        </button>
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
