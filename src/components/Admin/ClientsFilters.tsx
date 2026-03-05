import { CLIENT_TYPE_LABELS, CLIENT_TYPE_VALUES } from '../../lib/schemas/adminClientsSchema';

export type TypeFilter = '' | 'direct' | 'intermediair' | 'detacheerder';
export type StatusFilter = '' | 'ACTIVE' | 'BLOCKED';

interface ClientsFiltersProps {
  type: TypeFilter;
  status: StatusFilter;
  search: string;
  onTypeChange: (v: TypeFilter) => void;
  onStatusChange: (v: StatusFilter) => void;
  onSearchChange: (v: string) => void;
}

export function ClientsFilters({
  type,
  status,
  search,
  onTypeChange,
  onStatusChange,
  onSearchChange,
}: ClientsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value as TypeFilter)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
        >
          <option value="">Alle</option>
          {CLIENT_TYPE_VALUES.map((v) => (
            <option key={v} value={v}>
              {CLIENT_TYPE_LABELS[v]}
            </option>
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
          placeholder="Bedrijfsnaam of e-mail..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
        />
      </div>
    </div>
  );
}
