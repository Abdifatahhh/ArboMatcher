import { Link } from 'react-router-dom';
import type { AdminApplicationRow } from '../../services/adminApplicationsService';
import { AdminBadge } from './AdminBadge';
import { tableStyles as t } from './AdminTableWrapper';
import { filterStyles as f } from './AdminFiltersBar';

const STATUS_BADGE: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'neutral' }> = {
  ACCEPTED: { label: 'Geaccepteerd', variant: 'success' },
  REJECTED: { label: 'Afgewezen', variant: 'danger' },
  SHORTLISTED: { label: 'Shortlist', variant: 'info' },
  PENDING: { label: 'In afwachting', variant: 'neutral' },
};

const APPLICATION_STATUSES = ['PENDING', 'SHORTLISTED', 'REJECTED', 'ACCEPTED'] as const;
type AppStatus = (typeof APPLICATION_STATUSES)[number];

function normalizeAppStatus(s: string | undefined | null): AppStatus {
  if (APPLICATION_STATUSES.includes(s as AppStatus)) return s as AppStatus;
  return 'PENDING';
}

interface ApplicationsTableProps {
  rows: AdminApplicationRow[];
  onStatusChange: (applicationId: string, status: 'PENDING' | 'SHORTLISTED' | 'REJECTED' | 'ACCEPTED') => void;
  isDemo?: boolean;
}

export function ApplicationsTable({ rows, onStatusChange }: ApplicationsTableProps) {
  return (
    <table className={t.table}>
      <thead className={t.thead}>
        <tr>
          <th className={t.th}>Opdracht</th>
          <th className={t.th}>Professional</th>
          <th className={t.th}>Status</th>
          <th className={t.th}>Datum</th>
          <th className={t.thRight}>Wijzig status</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ application, job, profile }) => {
          const st = normalizeAppStatus(application.status);
          const badge = STATUS_BADGE[st] ?? { label: st, variant: 'neutral' as const };
          return (
            <tr key={application.id} className={t.row}>
              <td className={t.td}>
                <Link to={`/opdrachten/${application.job_id}`} className={t.link}>{job?.title || '—'}</Link>
              </td>
              <td className={t.td}>
                <Link to={`/admin/professionals/${application.professional_id}`} className={t.link}>{profile?.full_name || '—'}</Link>
                {profile?.email && <div className={t.secondary}>{profile.email}</div>}
              </td>
              <td className={t.td}><AdminBadge variant={badge.variant} dot>{badge.label}</AdminBadge></td>
              <td className={t.td}>{new Date(application.created_at).toLocaleDateString('nl-NL')}</td>
              <td className={`${t.td} text-right`}>
                <select
                  value={st}
                  onChange={(e) => onStatusChange(application.id, e.target.value as AppStatus)}
                  className={`${f.select} !h-8 text-xs`}
                >
                  {APPLICATION_STATUSES.map((s) => <option key={s} value={s}>{STATUS_BADGE[s]?.label ?? s}</option>)}
                </select>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
