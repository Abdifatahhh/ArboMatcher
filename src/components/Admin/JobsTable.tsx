import { Link } from 'react-router-dom';
import type { AdminJobRow } from '../../services/adminJobsService';
import { Eye } from 'lucide-react';
import { AdminBadge } from './AdminBadge';
import { tableStyles as t } from './AdminTableWrapper';
import { filterStyles as f } from './AdminFiltersBar';

const JOB_STATUSES = ['DRAFT', 'PUBLISHED', 'CLOSED'] as const;
type JobStatusValue = (typeof JOB_STATUSES)[number];

const STATUS_BADGE: Record<string, { label: string; variant: 'success' | 'warning' | 'neutral' }> = {
  PUBLISHED: { label: 'Gepubliceerd', variant: 'success' },
  DRAFT: { label: 'Concept', variant: 'warning' },
  CLOSED: { label: 'Gesloten', variant: 'neutral' },
};

function normalizeJobStatus(s: string | undefined | null): JobStatusValue {
  if (s === 'DRAFT' || s === 'PUBLISHED' || s === 'CLOSED') return s;
  return 'DRAFT';
}

interface JobsTableProps {
  rows: AdminJobRow[];
  onStatusChange: (jobId: string, status: 'DRAFT' | 'PUBLISHED' | 'CLOSED') => void;
  isDemo?: boolean;
}

export function JobsTable({ rows, onStatusChange }: JobsTableProps) {
  return (
    <table className={t.table}>
      <thead className={t.thead}>
        <tr>
          <th className={t.th}>Opdracht</th>
          <th className={t.th}>Organisatie</th>
          <th className={t.th}>Status</th>
          <th className={t.th}>Datum</th>
          <th className={t.thRight}>Acties</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ job, employer }) => {
          const st = normalizeJobStatus(job.status);
          const badge = STATUS_BADGE[st] ?? { label: st, variant: 'neutral' as const };
          return (
            <tr key={job.id} className={t.row}>
              <td className={t.tdWrap}>
                <Link to={`/opdrachten/${job.id}`} className={t.link}>{job.title}</Link>
                {job.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-xs">{job.description}</p>}
              </td>
              <td className={t.td}>
                <Link to={employer ? `/admin/opdrachtgevers/${employer.id}` : '#'} className="text-sm text-slate-600 hover:text-emerald-600 transition-colors">
                  {job.company_name || employer?.company_name || '—'}
                </Link>
              </td>
              <td className={t.td}>
                <div className="flex items-center gap-2">
                  <select
                    value={st}
                    onChange={(e) => onStatusChange(job.id, e.target.value as JobStatusValue)}
                    className={`${f.select} !h-8 text-xs`}
                  >
                    <option value="DRAFT">Concept</option>
                    <option value="PUBLISHED">Gepubliceerd</option>
                    <option value="CLOSED">Gesloten</option>
                  </select>
                  <AdminBadge variant={badge.variant} dot>{badge.label}</AdminBadge>
                </div>
              </td>
              <td className={t.td}>{new Date(job.created_at).toLocaleDateString('nl-NL')}</td>
              <td className={`${t.td} text-right`}>
                <Link to={`/opdrachten/${job.id}`} className={t.actionBtn} title="Bekijken"><Eye className="w-4 h-4" /></Link>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
