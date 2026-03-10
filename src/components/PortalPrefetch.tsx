import { useEffect } from 'react';
import { getAuthBaseUrl } from '../config/portal';

const PORTAL_URL = 'https://portal.arbomatcher.nl/';

export function PortalPrefetch() {
  useEffect(() => {
    if (!getAuthBaseUrl()) return;
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = PORTAL_URL;
    document.head.appendChild(link);
    return () => link.remove();
  }, []);
  return null;
}
