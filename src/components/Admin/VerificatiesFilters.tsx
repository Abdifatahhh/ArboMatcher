import type { VerificationFilter } from '../../services/adminDoctorsService';

interface VerificatiesFiltersProps {
  verification: VerificationFilter;
  search: string;
  onVerificationChange: (v: VerificationFilter) => void;
  onSearchChange: (v: string) => void;
}

const VERIFICATION_LABELS: Record<string, string> = {
  '': 'Alle',
  PENDING: 'Wachtend',
  VERIFIED: 'Geverifieerd',
  REJECTED: 'Afgewezen',
  UNVERIFIED: 'Niet geverifieerd',
};

export function VerificatiesFilters({
  verification,
  search,
  onVerificationChange,
  onSearchChange,
}: VerificatiesFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div>
        <label className="block text-xs font-medium text-emerald-800/80 mb-1">Status</label>
        <select value={verification} onChange={(e) => onVerificationChange(e.target.value as VerificationFilter)} className="px-4 py-2.5 bg-white border border-emerald-200/80 rounded-xl text-gray-800 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition">
          {(['', 'PENDING', 'VERIFIED', 'REJECTED', 'UNVERIFIED'] as const).map((v) => (
            <option key={v || 'all'} value={v}>{VERIFICATION_LABELS[v] ?? v}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-medium text-emerald-800/80 mb-1">Zoeken</label>
        <input type="search" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Naam, e-mail of BIG..." className="w-full px-4 py-2.5 bg-white border border-emerald-200/80 rounded-xl text-gray-800 placeholder:text-gray-400 focus:ring-2 focus:ring-[#4FA151] focus:border-[#4FA151] transition" />
      </div>
    </div>
  );
}
