export const PORTAL_HOST = 'portal.arbomatcher.nl';

export function isPortal(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hostname === PORTAL_HOST;
}

export function getAuthBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  return window.location.hostname === PORTAL_HOST ? '' : `https://${PORTAL_HOST}`;
}

export function getLoginPath(): string {
  return isPortal() ? '/' : '/login';
}
