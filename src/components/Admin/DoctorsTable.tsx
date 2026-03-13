import { Link } from 'react-router-dom';
import type { AdminDoctorRow } from '../../services/adminDoctorsService';
import { Eye, Ban, CheckCircle, Crown } from 'lucide-react';
import { AdminBadge } from './AdminBadge';
import { tableStyles as t } from './AdminTableWrapper';

const VERIFICATION_BADGE: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'neutral' }> = {
  VERIFIED: { label: 'Geverifieerd', variant: 'success' },
  PENDING: { label: 'In behandeling', variant: 'warning' },
  REJECTED: { label: 'Afgewezen', variant: 'danger' },
  UNVERIFIED: { label: 'Niet geverifieerd', variant: 'neutral' },
};

interface DoctorsTableProps {
  rows: AdminDoctorRow[];
  onToggleBlock: (doctorId: string) => void;
}

export function DoctorsTable({ rows, onToggleBlock }: DoctorsTableProps) {
  return (
    <table className={t.table}>
      <thead className={t.thead}>
        <tr>
          <th className={t.th}>Naam</th>
          <th className={t.th}>E-mail</th>
          <th className={t.th}>BIG</th>
          <th className={t.th}>Verificatie</th>
          <th className={t.th}>Sollicitaties</th>
          <th className={t.th}>Registratie</th>
          <th className={t.th}>Status</th>
          <th className={t.thRight}>Acties</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ doctor, profile, applications_count }) => {
          const isBlocked = profile.status === 'BLOCKED';
          const badge = VERIFICATION_BADGE[doctor.verification_status] ?? { label: doctor.verification_status, variant: 'neutral' as const };
          return (
            <tr key={doctor.id} className={t.row}>
              <td className={t.td}>
                <div className="flex items-center gap-1.5">
                  <Link to={`/admin/professionals/${doctor.id}`} className={t.link}>{profile.full_name || '—'}</Link>
                  {(doctor as { plan?: string }).plan === 'PRO' && <Crown className="w-3.5 h-3.5 text-amber-500" title="PRO" />}
                </div>
              </td>
              <td className={t.td}>{profile.email}</td>
              <td className={t.td}><code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded">{doctor.big_number}</code></td>
              <td className={t.td}><AdminBadge variant={badge.variant} dot>{badge.label}</AdminBadge></td>
              <td className={t.td}>{applications_count}</td>
              <td className={t.td}>{new Date(profile.created_at).toLocaleDateString('nl-NL')}</td>
              <td className={t.td}><AdminBadge variant={isBlocked ? 'danger' : 'success'} dot>{isBlocked ? 'Geblokkeerd' : 'Actief'}</AdminBadge></td>
              <td className={`${t.td} text-right`}>
                <div className="flex items-center justify-end gap-1">
                  <Link to={`/admin/professionals/${doctor.id}`} className={t.actionBtn} title="Bekijken"><Eye className="w-4 h-4" /></Link>
                  <button type="button" onClick={() => onToggleBlock(doctor.id)} className={t.actionBtn} title={isBlocked ? 'Deblokkeren' : 'Blokkeren'}>
                    {isBlocked ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Ban className="w-4 h-4 text-red-400" />}
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
