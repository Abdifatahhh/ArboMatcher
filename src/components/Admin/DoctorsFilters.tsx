import type { VerificationFilter, StatusFilter } from '../../services/adminDoctorsService';

interface DoctorsFiltersProps {
  verification: VerificationFilter;
  status: StatusFilter;
  search: string;
  onVerificationChange: (v: VerificationFilter) => void;
  onStatusChange: (v: StatusFilter) => void;
  onSearchChange: (v: string) => void;
}

const VERIFICATION_LABELS: Record<string, string> = {
  '': 'Alle',
  UNVERIFIED: 'Niet geverifieerd',
  PENDING: 'In behandeling',
  VERIFIED: 'Geverifieerd',
  REJECTED: 'Afgewezen',
};

export function DoctorsFilters({
  verification,
  status,
  search,
  onVerificationChange,
  onStatusChange,
  onSearchChange,
}: DoctorsFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4 mb-6">
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-1">Verificatie</label>
        <select
          value={verification}
          onChange={(e) => onVerificationChange(e.target.value as VerificationFilter)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
        >
          {(['', 'UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'] as const).map((v) => (
            <option key={v || 'all'} value={v}>
              {VERIFICATION_LABELS[v] ?? v}
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
          placeholder="Naam, e-mail of BIG..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0F172A] focus:border-transparent"
        />
      </div>
    </div>
  );
}
