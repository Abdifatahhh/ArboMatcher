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
    <div className="flex flex-wrap items-center gap-4">
      <div>
        <label className="block text-xs font-medium text-emerald-800/80 mb-1">Verificatie</label>
        <select value={verification} onChange={(e) => onVerificationChange(e.target.value as VerificationFilter)} className="px-4 py-2.5 bg-white border border-emerald-200/80 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition">
          {(['', 'UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'] as const).map((v) => (
            <option key={v || 'all'} value={v}>{VERIFICATION_LABELS[v] ?? v}</option>
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
        <input type="search" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Naam, e-mail of BIG..." className="w-full px-4 py-2.5 bg-white border border-emerald-200/80 rounded-xl text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition" />
      </div>
    </div>
  );
}
