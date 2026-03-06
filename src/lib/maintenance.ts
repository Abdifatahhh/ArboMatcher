export const MAINTENANCE_STORAGE_KEY = 'arbo-admin-maintenance';
export const MAINTENANCE_BYPASS_KEY = 'arbo-maintenance-bypass';

export interface MaintenanceSettings {
  enabled: boolean;
  password: string;
  message: string;
}

const defaultMessage = 'Website is momenteel in onderhoud.';

export function getMaintenanceSettings(): MaintenanceSettings {
  if (typeof window === 'undefined') {
    return { enabled: false, password: '', message: defaultMessage };
  }
  try {
    const stored = localStorage.getItem(MAINTENANCE_STORAGE_KEY);
    if (!stored) return { enabled: false, password: '', message: defaultMessage };
    const data = JSON.parse(stored);
    return {
      enabled: !!data.enabled,
      password: typeof data.password === 'string' ? data.password : '',
      message: typeof data.message === 'string' && data.message.trim() ? data.message.trim() : defaultMessage,
    };
  } catch {
    return { enabled: false, password: '', message: defaultMessage };
  }
}

export function hasMaintenanceBypass(): boolean {
  if (typeof window === 'undefined') return false;
  return !!sessionStorage.getItem(MAINTENANCE_BYPASS_KEY);
}

export function setMaintenanceBypass(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(MAINTENANCE_BYPASS_KEY, '1');
  }
}
