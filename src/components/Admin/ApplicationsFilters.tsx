import type { ApplicationStatusFilter } from '../../services/adminApplicationsService';
import { filterStyles as f } from './AdminFiltersBar';

const STATUS_LABELS: Record<Exclude<ApplicationStatusFilter, ''>, string> = {
  PENDING: 'In afwachting',
  SHORTLISTED: 'Op shortlist',
  ACCEPTED: 'Geaccepteerd',
  REJECTED: 'Afgewezen',
};

interface ApplicationsFiltersProps {
  status: ApplicationStatusFilter;
  search: string;
  onStatusChange: (v: ApplicationStatusFilter) => void;
  onSearchChange: (v: string) => void;
}

export function ApplicationsFilters({ status, search, onStatusChange, onSearchChange }: ApplicationsFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className={f.label}>Status</label>
        <select value={status} onChange={(e) => onStatusChange(e.target.value as ApplicationStatusFilter)} className={f.select}>
          <option value="">Alle</option>
          {(Object.keys(STATUS_LABELS) as Exclude<ApplicationStatusFilter, ''>[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className={f.label}>Zoeken</label>
        <input type="search" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Opdracht of arts..." className={f.input} />
      </div>
    </div>
  );
}
