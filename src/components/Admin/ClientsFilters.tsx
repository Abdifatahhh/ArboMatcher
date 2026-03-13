import { filterStyles as f } from './AdminFiltersBar';

export type StatusFilter = '' | 'ACTIVE' | 'BLOCKED';

interface ClientsFiltersProps {
  status: StatusFilter;
  search: string;
  onStatusChange: (v: StatusFilter) => void;
  onSearchChange: (v: string) => void;
}

export function ClientsFilters({ status, search, onStatusChange, onSearchChange }: ClientsFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
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
        <input type="search" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Bedrijfsnaam of e-mail..." className={f.input} />
      </div>
    </div>
  );
}
