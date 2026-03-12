export const PORTAL_HOST = 'portal.arbomatcher.nl';

export function isPortal(): boolean {
  if (typeof window === 'undefined') return false;
  if (import.meta.env.DEV && import.meta.env.VITE_SITE === 'marketing') return false;
  const host = window.location.hostname;
  if (host === PORTAL_HOST) return true;
  if (import.meta.env.DEV && (host === 'localhost' || host === '127.0.0.1')) return true;
  return false;
}

export function getAuthBaseUrl(): string {
  if (typeof window === 'undefined') return '';
  return isPortal() ? '' : `https://${PORTAL_HOST}`;
}

export function getLoginPath(): string {
  return isPortal() ? '/' : '/login';
}
