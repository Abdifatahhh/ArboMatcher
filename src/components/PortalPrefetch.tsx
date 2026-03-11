import { useEffect } from 'react';
import { getAuthBaseUrl } from '../config/portal';
import { preloadMarketingRoutes } from '../routes/lazyPages';

const PORTAL_URL = 'https://portal.arbomatcher.nl/';

export function PortalPrefetch() {
  useEffect(() => {
    if (!getAuthBaseUrl()) return;
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

export function RoutePreloader() {
  useEffect(() => {
    const cb = () => preloadMarketingRoutes();
    const run = () => {
      if (typeof requestIdleCallback !== 'undefined') requestIdleCallback(cb, { timeout: 3000 });
      else setTimeout(cb, 1000);
    };
    if (document.readyState === 'complete') setTimeout(run, 500);
    else window.addEventListener('load', () => setTimeout(run, 500));
  }, []);
  return null;
}
