export const PORTAL_HOST = 'portal.arbomatcher.nl';

export function getAuthBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.hostname === PORTAL_HOST ? '' : `https://${PORTAL_HOST}`;
}
