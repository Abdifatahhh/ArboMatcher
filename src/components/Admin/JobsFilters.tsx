import type { JobStatusFilter } from '../../services/adminJobsService';

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

export function JobsFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
}: JobsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div>
        <label className="block text-xs font-medium text-emerald-800/80 mb-1">Status</label>
        <select value={status} onChange={(e) => onStatusChange(e.target.value as JobStatusFilter)} className="px-4 py-2.5 bg-white border border-emerald-200/80 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition">
          <option value="">Alle</option>
          {(Object.keys(STATUS_LABELS) as Exclude<JobStatusFilter, ''>[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-emerald-800/80 mb-1">Zoeken</label>
        <input type="search" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Titel of bedrijfsnaam..." className="w-full px-4 py-2.5 bg-white border border-emerald-200/80 rounded-xl text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition" />
      </div>
    </div>
  );
}
