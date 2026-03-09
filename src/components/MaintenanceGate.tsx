import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMaintenanceSettings, hasMaintenanceBypass } from '../lib/maintenance';
import MaintenancePage from '../pages/MaintenancePage';

interface MaintenanceGateProps {
  children: React.ReactNode;
}

export function MaintenanceGate({ children }: MaintenanceGateProps) {
  const { profile, loading: authLoading } = useAuth();
  const [settings, setSettings] = useState(() => getMaintenanceSettings());
  const [bypass, setBypass] = useState(() => hasMaintenanceBypass());

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

  const handleBypass = useCallback(() => {
    setBypass(true);
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#0F172A]/20 border-t-[#4FA151]" />
        <p className="text-[#0F172A] font-medium">Laden...</p>
      </div>
    );
  }

  if (showApp) {
    return <>{children}</>;
  }

  return <MaintenancePage onBypass={handleBypass} />;
}
