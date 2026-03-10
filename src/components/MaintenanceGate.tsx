import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMaintenanceSettings, hasMaintenanceBypass } from '../lib/maintenance';
import MaintenancePage from '../pages/MaintenancePage';

const MIN_SHOW_DELAY_MS = 400;

interface MaintenanceGateProps {
  children: React.ReactNode;
}

export function MaintenanceGate({ children }: MaintenanceGateProps) {
  const { profile, loading: authLoading } = useAuth();
  const [settings, setSettings] = useState(() => getMaintenanceSettings());
  const [bypass, setBypass] = useState(() => hasMaintenanceBypass());
  const [minDelayPassed, setMinDelayPassed] = useState(false);

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
  const showApp = !settings.enabled || isAdmin || bypass;
  const ready = minDelayPassed && !authLoading;

  const handleBypass = useCallback(() => {
    setBypass(true);
  }, []);

  if (!ready) {
    return <div className="min-h-screen bg-gradient-to-b from-[#E8F5E9] via-[#F4FAF4] to-white" />;
  }

  if (showApp) {
    return <>{children}</>;
  }

  return <MaintenancePage onBypass={handleBypass} />;
}
