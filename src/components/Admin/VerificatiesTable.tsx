import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import type { AdminDoctorRow } from '../../services/adminDoctorsService';
import type { BigCheckResult } from '../../services/bigCheckService';
import { CheckCircle, XCircle, Shield, Search, Loader2 } from 'lucide-react';
import { AdminBadge } from './AdminBadge';
import { tableStyles as t } from './AdminTableWrapper';

const VERIFICATION_BADGE: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'neutral' }> = {
  VERIFIED: { label: 'Geverifieerd', variant: 'success' },
  PENDING: { label: 'Wachtend', variant: 'warning' },
  REJECTED: { label: 'Afgewezen', variant: 'danger' },
  UNVERIFIED: { label: 'Niet geverifieerd', variant: 'neutral' },
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

export function VerificatiesTable({ rows, onApprove, onReject, onBigCheck, checkingBigId, bigCheckResult, bigCheckDoctorId, onCloseBigCheck }: VerificatiesTableProps) {
  return (
    <table className={t.table}>
      <thead className={t.thead}>
        <tr>
          <th className={t.th}>Naam</th>
          <th className={t.th}>E-mail</th>
          <th className={t.th}>BIG-nummer</th>
          <th className={t.th}>Status</th>
          <th className={t.th}>Datum</th>
          <th className={t.thRight}>Acties</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ doctor, profile }) => {
          const isPending = doctor.verification_status === 'PENDING';
          const isChecking = checkingBigId === doctor.id;
          const showResult = bigCheckDoctorId === doctor.id && bigCheckResult;
          const badge = VERIFICATION_BADGE[doctor.verification_status] ?? { label: doctor.verification_status, variant: 'neutral' as const };
          return (
            <Fragment key={doctor.id}>
              <tr className={t.row}>
                <td className={t.td}>
                  <Link to={`/admin/professionals/${doctor.id}`} className={t.link}>{profile.full_name || '—'}</Link>
                </td>
                <td className={t.td}>{profile.email}</td>
                <td className={t.td}><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{doctor.big_number}</code></td>
                <td className={t.td}><AdminBadge variant={badge.variant} dot>{badge.label}</AdminBadge></td>
                <td className={t.td}>{new Date(profile.created_at).toLocaleDateString('nl-NL')}</td>
                <td className={`${t.td} text-right`}>
                  <div className="flex items-center justify-end gap-1.5 flex-wrap">
                    <button type="button" onClick={() => onBigCheck(doctor.id, doctor.big_number)} disabled={isChecking} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 transition">
                      {isChecking ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
                      BIG check
                    </button>
                    {isPending && (
                      <>
                        <button type="button" onClick={() => onApprove(doctor.id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 transition">
                          <CheckCircle className="w-3.5 h-3.5" /> Goedkeuren
                        </button>
                        <button type="button" onClick={() => onReject(doctor.id)} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 transition">
                          <XCircle className="w-3.5 h-3.5" /> Afwijzen
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
              {showResult && bigCheckResult ? (
                <tr key={`${doctor.id}-result`}>
                  <td colSpan={6} className="px-4 py-3 text-sm bg-slate-50 border-b border-slate-100">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-slate-500 shrink-0" />
                        <span className={bigCheckResult.found ? 'text-emerald-700' : bigCheckResult.formatValid ? 'text-amber-700' : 'text-red-700'}>
                          {bigCheckResult.message}
                          {bigCheckResult.name && <span className="block text-slate-500 mt-0.5">Naam in register: {bigCheckResult.name}</span>}
                          {bigCheckResult.error && <span className="block text-slate-400 mt-0.5 text-xs">{bigCheckResult.error}</span>}
                        </span>
                      </div>
                      <button type="button" onClick={onCloseBigCheck} className="text-slate-500 hover:text-slate-700 text-xs font-medium">Sluiten</button>
                    </div>
                  </td>
                </tr>
              ) : null}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
