import type { JobStatusFilter } from '../../services/adminJobsService';
import { filterStyles as f } from './AdminFiltersBar';

const STATUS_LABELS: Record<Exclude<JobStatusFilter, ''>, string> = {
  DRAFT: 'Concept',
  PUBLISHED: 'Gepubliceerd',
  CLOSED: 'Gesloten',
};

interface JobsFiltersProps {
  status: JobStatusFilter;
  search: string;
  onStatusChange: (v: JobStatusFilter) => void;
  onSearchChange: (v: string) => void;
}

export function JobsFilters({ status, search, onStatusChange, onSearchChange }: JobsFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className={f.label}>Status</label>
        <select value={status} onChange={(e) => onStatusChange(e.target.value as JobStatusFilter)} className={f.select}>
          <option value="">Alle</option>
          {(Object.keys(STATUS_LABELS) as Exclude<JobStatusFilter, ''>[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className={f.label}>Zoeken</label>
        <input type="search" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Titel of bedrijfsnaam..." className={f.input} />
      </div>
    </div>
  );
}
