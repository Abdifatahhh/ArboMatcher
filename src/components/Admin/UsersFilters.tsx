import type { RoleFilter, StatusFilter } from '../../services/adminUsersService';

const ROLE_LABELS: Record<Exclude<RoleFilter, ''>, string> = {
  ARTS: 'Arts',
  OPDRACHTGEVER: 'Opdrachtgever',
  ADMIN: 'Admin',
};

interface UsersFiltersProps {
  role: RoleFilter;
  status: StatusFilter;
  search: string;
  onRoleChange: (v: RoleFilter) => void;
  onStatusChange: (v: StatusFilter) => void;
  onSearchChange: (v: string) => void;
}

export function UsersFilters({
  role,
  status,
  search,
  onRoleChange,
  onStatusChange,
  onSearchChange,
}: UsersFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div>
        <label className="block text-xs font-medium text-emerald-800/80 mb-1">Rol</label>
        <select value={role} onChange={(e) => onRoleChange(e.target.value as RoleFilter)} className="px-4 py-2.5 bg-white border border-emerald-200/80 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition">
          <option value="">Alle</option>
          {(Object.keys(ROLE_LABELS) as Exclude<RoleFilter, ''>[]).map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-emerald-800/80 mb-1">Status</label>
        <select value={status} onChange={(e) => onStatusChange(e.target.value as StatusFilter)} className="px-4 py-2.5 bg-white border border-emerald-200/80 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition">
          <option value="">Alle</option>
          <option value="ACTIVE">Actief</option>
          <option value="BLOCKED">Geblokkeerd</option>
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-emerald-800/80 mb-1">Zoeken</label>
        <input type="search" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Naam of e-mail..." className="w-full px-4 py-2.5 bg-white border border-emerald-200/80 rounded-xl text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition" />
      </div>
    </div>
  );
}
