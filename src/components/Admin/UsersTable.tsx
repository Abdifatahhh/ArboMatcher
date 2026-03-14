import { Link } from 'react-router-dom';
import type { Profile } from '../../lib/types';
import { getRoleLabel } from '../../lib/roleLabels';
import { Eye, Ban, CheckCircle, Trash2 } from 'lucide-react';
import { AdminBadge } from './AdminBadge';
import { tableStyles as t } from './AdminTableWrapper';

interface UsersTableProps {
  rows: Profile[];
  selectedIds: string[];
  onToggleBlock: (profileId: string) => void;
  onToggleSelect: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onDelete: (id: string) => void;
  canDelete?: boolean;
}

export function UsersTable({ rows, selectedIds, onToggleBlock, onToggleSelect, onSelectAll, onDelete, canDelete = true }: UsersTableProps) {
  const allSelected = rows.length > 0 && rows.every((p) => selectedIds.includes(p.id));
  const someSelected = selectedIds.length > 0;

  return (
    <table className={t.table}>
      <thead className={t.thead}>
        <tr>
          <th className="w-10 px-4 py-3">
            <input
              type="checkbox"
              checked={allSelected}
              ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              aria-label="Alles selecteren"
            />
          </th>
          <th className={t.th}>Naam</th>
          <th className={t.th}>E-mail</th>
          <th className={t.th}>Rol</th>
          <th className={t.th}>Status</th>
          <th className={t.th}>Aangemaakt</th>
          <th className={t.thRight}>Acties</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((profile) => {
          const isBlocked = profile.status === 'BLOCKED';
          const selected = selectedIds.includes(profile.id);
          return (
            <tr key={profile.id} className={`${t.row} ${selected ? 'bg-emerald-50/40' : ''}`}>
              <td className="w-10 px-4 py-3.5">
                <input
                  type="checkbox"
                  checked={selected}
                  onChange={(e) => onToggleSelect(profile.id, e.target.checked)}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  aria-label={`Selecteer ${profile.full_name || profile.email}`}
                />
              </td>
              <td className={t.td}>
                <Link to={`/admin/gebruikers/${profile.id}`} className={t.link}>{profile.full_name || 'Geen naam'}</Link>
              </td>
              <td className={t.td}>{profile.email}</td>
              <td className={t.td}>
                <AdminBadge variant="neutral">{getRoleLabel(profile.role)}</AdminBadge>
              </td>
              <td className={t.td}>
                <AdminBadge variant={isBlocked ? 'danger' : 'success'} dot>{isBlocked ? 'Geblokkeerd' : 'Actief'}</AdminBadge>
              </td>
              <td className={t.td}>{new Date(profile.created_at).toLocaleDateString('nl-NL')}</td>
              <td className={`${t.td} text-right`}>
                <div className="flex items-center justify-end gap-1">
                  <Link to={`/admin/gebruikers/${profile.id}`} className={t.actionBtn} title="Bekijken"><Eye className="w-4 h-4" /></Link>
                  <button type="button" onClick={() => onToggleBlock(profile.id)} className={t.actionBtn} title={isBlocked ? 'Deblokkeren' : 'Blokkeren'}>
                    {isBlocked ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Ban className="w-4 h-4 text-red-400" />}
                  </button>
                  {canDelete && (
                    <button type="button" onClick={() => onDelete(profile.id)} className={`${t.actionBtn} hover:!text-red-600 hover:!bg-red-50`} title="Verwijderen">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
