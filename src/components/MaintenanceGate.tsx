import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMaintenanceSettings, hasMaintenanceBypass } from '../lib/maintenance';
import MaintenancePage from '../pages/MaintenancePage';

const MIN_SHOW_DELAY_MS = 200;

function isEmailVerificationOrAuthCallback(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.location.pathname === '/verificatie-gelukt') return true;
  return /[#&](access_token|refresh_token)=/.test(window.location.hash || '');
}

interface MaintenanceGateProps {
  children: React.ReactNode;
}

export function MaintenanceGate({ children }: MaintenanceGateProps) {
  const { profile, loading: authLoading } = useAuth();
  const [settings, setSettings] = useState(() => getMaintenanceSettings());
  const [bypass, setBypass] = useState(() => hasMaintenanceBypass());
  const [minDelayPassed, setMinDelayPassed] = useState(false);
  const allowForAuth = isEmailVerificationOrAuthCallback();

  useEffect(() => {
    const t = setTimeout(() => setMinDelayPassed(true), MIN_SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const refreshSettings = useCallback(() => {
    setSettings(getMaintenanceSettings());
  }, []);

  useEffect(() => {
    refreshSettings();
    const onStorage = () => {
      setSettings(getMaintenanceSettings());
      setBypass(hasMaintenanceBypass());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [refreshSettings]);

  const isAdmin = profile?.role === 'ADMIN';
  const showApp = !settings.enabled || isAdmin || bypass || allowForAuth;
  const mustWaitForAuth = settings.enabled && !bypass && !allowForAuth;
  const ready = minDelayPassed && (!mustWaitForAuth || !authLoading);

  const handleBypass = useCallback(() => {
    setBypass(true);
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-white" />;
  }

  if (showApp) {
    return <>{children}</>;
  }

  return <MaintenancePage onBypass={handleBypass} />;
}
