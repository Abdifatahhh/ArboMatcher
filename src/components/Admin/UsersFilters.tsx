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
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Rol</label>
        <select
          value={role}
          onChange={(e) => onRoleChange(e.target.value as RoleFilter)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
        >
          <option value="">Alle</option>
          {(Object.keys(ROLE_LABELS) as Exclude<RoleFilter, ''>[]).map((r) => (
            <option key={r} value={r}>{ROLE_LABELS[r]}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
        >
          <option value="">Alle</option>
          <option value="ACTIVE">Actief</option>
          <option value="BLOCKED">Geblokkeerd</option>
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-gray-500 mb-1">Zoeken</label>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Naam of e-mail..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
        />
      </div>
    </div>
  );
}
