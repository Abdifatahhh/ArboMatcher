import type { VerificationFilter } from '../../services/adminDoctorsService';
import { filterStyles as f } from './AdminFiltersBar';

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

export function VerificatiesFilters({ verification, search, onVerificationChange, onSearchChange }: VerificatiesFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className={f.label}>Status</label>
        <select value={verification} onChange={(e) => onVerificationChange(e.target.value as VerificationFilter)} className={f.select}>
          {(['', 'PENDING', 'VERIFIED', 'REJECTED', 'UNVERIFIED'] as const).map((v) => (
            <option key={v || 'all'} value={v}>{VERIFICATION_LABELS[v] ?? v}</option>
          ))}
        </select>
      </div>
      <div className="flex-1 min-w-[200px]">
        <label className={f.label}>Zoeken</label>
        <input type="search" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Naam, e-mail of BIG..." className={f.input} />
      </div>
    </div>
  );
}
