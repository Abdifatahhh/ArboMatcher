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
    <div className="flex flex-wrap items-center gap-4">
      <div>
        <label className="block text-xs font-medium text-emerald-800/80 mb-1">Type</label>
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value as TypeFilter)}
          className="px-4 py-2.5 bg-white border border-emerald-200/80 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition"
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
        <label className="block text-xs font-medium text-emerald-800/80 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as StatusFilter)}
          className="px-4 py-2.5 bg-white border border-emerald-200/80 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition"
        >
          <option value="">Alle</option>
          <option value="ACTIVE">Actief</option>
          <option value="BLOCKED">Geblokkeerd</option>
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-emerald-800/80 mb-1">Zoeken</label>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Bedrijfsnaam of e-mail..."
          className="w-full px-4 py-2.5 bg-white border border-emerald-200/80 rounded-xl text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition"
        />
      </div>
    </div>
  );
}
