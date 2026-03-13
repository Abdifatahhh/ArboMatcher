import { Link } from 'react-router-dom';
import type { AdminClientRow } from '../../services/adminClientsService';
import { Eye, Ban, CheckCircle } from 'lucide-react';
import { AdminBadge } from './AdminBadge';
import { tableStyles as t } from './AdminTableWrapper';

interface ClientsTableProps {
  rows: AdminClientRow[];
  onToggleBlock: (employerId: string) => void;
}

export function ClientsTable({ rows, onToggleBlock }: ClientsTableProps) {
  return (
    <table className={t.table}>
      <thead className={t.thead}>
        <tr>
          <th className={t.th}>Bedrijfsnaam</th>
          <th className={t.th}>Contactpersoon</th>
          <th className={t.th}>E-mail</th>
          <th className={t.th}>Opdrachten</th>
          <th className={t.th}>Registratie</th>
          <th className={t.th}>Status</th>
          <th className={t.thRight}>Acties</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ employer, profile, jobs_count }) => {
          const isBlocked = profile.status === 'BLOCKED';
          return (
            <tr key={employer.id} className={t.row}>
              <td className={t.td}>
                <Link to={`/admin/opdrachtgevers/${employer.id}`} className={t.link}>{employer.company_name || '—'}</Link>
              </td>
              <td className={t.td}>{profile.full_name || '—'}</td>
              <td className={t.td}>{profile.email}</td>
              <td className={t.td}>{jobs_count}</td>
              <td className={t.td}>{new Date(profile.created_at).toLocaleDateString('nl-NL')}</td>
              <td className={t.td}><AdminBadge variant={isBlocked ? 'danger' : 'success'} dot>{isBlocked ? 'Geblokkeerd' : 'Actief'}</AdminBadge></td>
              <td className={`${t.td} text-right`}>
                <div className="flex items-center justify-end gap-1">
                  <Link to={`/admin/opdrachtgevers/${employer.id}`} className={t.actionBtn} title="Bekijken"><Eye className="w-4 h-4" /></Link>
                  <button type="button" onClick={() => onToggleBlock(employer.id)} className={t.actionBtn} title={isBlocked ? 'Deblokkeren' : 'Blokkeren'}>
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
