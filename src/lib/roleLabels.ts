import type { UserRole } from './types';

const LABELS: Record<UserRole, string> = {
  ADMIN: 'Admin',
  ORGANISATIE: 'Organisatie',
  professional: 'Professional',
  onboarding: 'Onboarding',
};

export function getRoleLabel(role: string | null | undefined): string {
  if (role == null) return '';
  return LABELS[role as UserRole] ?? (role.charAt(0).toUpperCase() + role.slice(1).toLowerCase());
}
