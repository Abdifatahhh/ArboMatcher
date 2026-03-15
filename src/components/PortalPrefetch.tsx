import { useEffect } from 'react';
import { getAuthBaseUrl } from '../config/portal';

const PORTAL_URL = 'https://portal.arbomatcher.nl/';

function canPrefetch(): boolean {
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  const connection = nav.connection;
  if (!connection) return true;
  if (connection.saveData) return false;
  return connection.effectiveType !== 'slow-2g' && connection.effectiveType !== '2g';
}

export function PortalPrefetch() {
  useEffect(() => {
    if (!getAuthBaseUrl()) return;
    if (!canPrefetch()) return;
    const run = () => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = PORTAL_URL;
      link.setAttribute('data-portal-prefetch', '');
      document.head.appendChild(link);
    };
    if (document.readyState === 'complete') setTimeout(run, 2000);
    else window.addEventListener('load', () => setTimeout(run, 2000));
  }, []);
  return null;
}
