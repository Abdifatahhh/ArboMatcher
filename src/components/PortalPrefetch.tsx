import { useEffect } from 'react';
import { getAuthBaseUrl } from '../config/portal';
import { preloadMarketingRoutes } from '../routes/lazyPages';

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

export function RoutePreloader() {
  useEffect(() => {
    const cb = () => preloadMarketingRoutes();
    const id = typeof requestIdleCallback !== 'undefined'
      ? requestIdleCallback(cb, { timeout: 2000 })
      : window.setTimeout(cb, 500);
    return () => (typeof cancelIdleCallback !== 'undefined' ? cancelIdleCallback(id) : clearTimeout(id));
  }, []);
  return null;
}
