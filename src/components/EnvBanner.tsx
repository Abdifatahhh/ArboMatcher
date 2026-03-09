import { useAuth } from '../context/AuthContext';

export function EnvBanner() {
  const { healthStatus } = useAuth();
  if (!healthStatus || healthStatus.healthy) return null;
  return (
    <div className="bg-amber-500 text-amber-950 text-center py-2 px-4 text-sm font-medium">
      Configuratie: {healthStatus.error} Zet dit in <code className="bg-amber-600/30 px-1 rounded">.env</code> en herstart de dev-server.
    </div>
  );
}
