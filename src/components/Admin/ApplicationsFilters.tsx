import type { ApplicationStatusFilter } from '../../services/adminApplicationsService';

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

export function ApplicationsFilters({
  status,
  search,
  onStatusChange,
  onSearchChange,
}: ApplicationsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as ApplicationStatusFilter)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
        >
          <option value="">Alle</option>
          {(Object.keys(STATUS_LABELS) as Exclude<ApplicationStatusFilter, ''>[]).map((s) => (
            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-gray-500 mb-1">Zoeken</label>
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Opdracht of arts..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
        />
      </div>
    </div>
  );
}
