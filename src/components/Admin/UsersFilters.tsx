import type { RoleFilter, StatusFilter } from '../../services/adminUsersService';
import { getRoleLabel } from '../../lib/roleLabels';
import { filterStyles as f } from './AdminFiltersBar';

const ROLE_VALUES: Exclude<RoleFilter, ''>[] = ['professional', 'ORGANISATIE', 'ADMIN', 'onboarding'];

interface UsersFiltersProps {
  role: RoleFilter;
  status: StatusFilter;
  search: string;
  onRoleChange: (v: RoleFilter) => void;
  onStatusChange: (v: StatusFilter) => void;
  onSearchChange: (v: string) => void;
}

export function UsersFilters({ role, status, search, onRoleChange, onStatusChange, onSearchChange }: UsersFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className={f.label}>Rol</label>
        <select value={role} onChange={(e) => onRoleChange(e.target.value as RoleFilter)} className={f.select}>
          <option value="">Alle rollen</option>
          {ROLE_VALUES.map((r) => <option key={r} value={r}>{getRoleLabel(r)}</option>)}
        </select>
      </div>
      <div>
        <label className={f.label}>Status</label>
        <select value={status} onChange={(e) => onStatusChange(e.target.value as StatusFilter)} className={f.select}>
          <option value="">Alle</option>
          <option value="ACTIVE">Actief</option>
          <option value="BLOCKED">Geblokkeerd</option>
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className={f.label}>Zoeken</label>
        <input type="search" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Naam of e-mail..." className={f.input} />
      </div>
    </div>
  );
}
