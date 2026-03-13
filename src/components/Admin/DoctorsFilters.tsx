import type { VerificationFilter, StatusFilter } from '../../services/adminDoctorsService';
import { filterStyles as f } from './AdminFiltersBar';

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

export function DoctorsFilters({ verification, status, search, onVerificationChange, onStatusChange, onSearchChange }: DoctorsFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label className={f.label}>Verificatie</label>
        <select value={verification} onChange={(e) => onVerificationChange(e.target.value as VerificationFilter)} className={f.select}>
          {(['', 'UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED'] as const).map((v) => (
            <option key={v || 'all'} value={v}>{VERIFICATION_LABELS[v] ?? v}</option>
          ))}
        </select>
      </div>
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
        <input type="search" value={search} onChange={(e) => onSearchChange(e.target.value)} placeholder="Naam, e-mail of BIG..." className={f.input} />
      </div>
    </div>
  );
}
