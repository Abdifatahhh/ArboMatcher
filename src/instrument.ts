const dsn = import.meta.env.VITE_SENTRY_DSN;

async function initSentry() {
  if (!dsn || typeof dsn !== 'string' || dsn.trim() === '') return;
  const Sentry = await import('@sentry/react');
  Sentry.init({
    dsn: dsn.trim(),
    environment: import.meta.env.MODE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: true, blockAllMedia: true }),
    ],
    tracesSampleRate: import.meta.env.DEV ? 0 : 0.05,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.2,
  });
}

const schedule = () => {
  void initSentry();
};

if (typeof window !== 'undefined') {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(schedule, { timeout: 2000 });
  } else {
    window.setTimeout(schedule, 800);
  }
} else {
  schedule();
}
