/**
 * Centrale constanten en label-mappings voor opdrachten (contractvorm, werkwijze).
 * Gebruik deze overal i.p.v. hardcoded waarden of labels.
 */

export type ContractForm = 'ZZP' | 'DETACHERING' | 'LOONDIENST';
export type RemoteType = 'REMOTE' | 'HYBRID' | 'ONSITE';

export const CONTRACT_FORM_VALUES: ContractForm[] = ['ZZP', 'DETACHERING', 'LOONDIENST'];

export const CONTRACT_FORM_OPTIONS: { value: ContractForm; label: string }[] = [
  { value: 'ZZP', label: 'ZZP / Freelance' },
  { value: 'DETACHERING', label: 'Detachering' },
  { value: 'LOONDIENST', label: 'Loondienst' },
];

export const REMOTE_TYPE_VALUES: RemoteType[] = ['ONSITE', 'HYBRID', 'REMOTE'];

export const REMOTE_TYPE_OPTIONS: { value: RemoteType; label: string }[] = [
  { value: 'ONSITE', label: 'Op locatie' },
  { value: 'HYBRID', label: 'Hybride' },
  { value: 'REMOTE', label: 'Remote (consult)' },
];

const CONTRACT_FORM_LABELS: Record<string, string> = {
  ZZP: 'ZZP / Freelance',
  DETACHERING: 'Detachering',
  LOONDIENST: 'Loondienst',
};

const REMOTE_TYPE_LABELS: Record<string, string> = {
  ONSITE: 'Op locatie',
  HYBRID: 'Hybride',
  REMOTE: 'Remote (consult)',
};

/** Alleen voor weergave van bestaande data; PROJECT is verwijderd en wordt nooit meer opgeslagen. */
const LEGACY_JOB_TYPE_TO_CONTRACT: Record<string, string> = {
  TIJDELIJK: 'ZZP / Freelance',
  INTERIM: 'ZZP / Freelance',
  VAST: 'Loondienst',
  PROJECT: 'ZZP / Freelance',
};

export function getContractFormLabel(value: string | null | undefined): string {
  if (!value) return '';
  return CONTRACT_FORM_LABELS[value] ?? LEGACY_JOB_TYPE_TO_CONTRACT[value] ?? value;
}

export function normalizeContractForm(value: string | null | undefined): ContractForm {
  if (!value) return 'ZZP';
  if (CONTRACT_FORM_VALUES.includes(value as ContractForm)) return value as ContractForm;
  if (value === 'PROJECT' || value === 'TIJDELIJK' || value === 'INTERIM') return 'ZZP';
  if (value === 'VAST') return 'LOONDIENST';
  return 'ZZP';
}

export function getRemoteTypeLabel(value: string | null | undefined): string {
  if (!value) return '';
  return REMOTE_TYPE_LABELS[value] ?? value;
}

export function isLegacyJobType(value: string): boolean {
  return value in LEGACY_JOB_TYPE_TO_CONTRACT;
}
